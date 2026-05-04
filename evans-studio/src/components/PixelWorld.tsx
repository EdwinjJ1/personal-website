"use client";

import { type PointerEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  broadcastItems,
  gameNotes,
  photoCards,
  projectCards,
  type HotspotId,
  type PanelId,
  worldHotspots,
} from "@/data/world";

type ControlState = {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
};

type ActiveHotspot = {
  id: HotspotId;
  label: string;
  action: string;
} | null;

type Facing = "down" | "right" | "up" | "left";

type SceneBridge = {
  controls: ControlState;
  clearControls: () => void;
  openPanel: (panel: HotspotId) => void;
  setHotspot: (hotspot: ActiveHotspot) => void;
  setArea: (area: string) => void;
  setIntroDone: (done: boolean) => void;
  setInteract: (handler: () => void) => void;
  setSkipIntro: (handler: () => void) => void;
  reducedMotion: boolean;
};

const WORLD_WIDTH = 2400;
const WORLD_HEIGHT = 1800;
const PHOTO_ROOM_WIDTH = 1800;
const PHOTO_ROOM_HEIGHT = 1200;
const MOBILE_CAMERA_ZOOM = 1.28;
const DESKTOP_CAMERA_ZOOM = 1.48;
const MOBILE_INTRO_ZOOM = 1.32;
const DESKTOP_INTRO_ZOOM = 1.6;
const MOBILE_INTERIOR_ZOOM = 1.38;
const DESKTOP_INTERIOR_ZOOM = 1.64;
const MOBILE_PHOTO_ROOM_ZOOM = 0.88;
const DESKTOP_PHOTO_ROOM_ZOOM = 1.2;

const directionFrames: Record<Facing, { walkStart: number; walkEnd: number; idle: number }> = {
  down: { walkStart: 0, walkEnd: 3, idle: 0 },
  right: { walkStart: 4, walkEnd: 7, idle: 4 },
  up: { walkStart: 8, walkEnd: 11, idle: 8 },
  left: { walkStart: 12, walkEnd: 15, idle: 12 },
};

const runtimeAssets = {
  evanWalk: "/media/pixel/sprites/01-evan-walk-sheet.png",
  evanIdle: "/media/pixel/sprites/02-evan-idle-sheet.png",
  evanInteract: "/media/pixel/sprites/03-evan-interact-sheet.png",
  visitor: "/media/pixel/sprites/05-visitor-npc.png",
  photographer: "/media/pixel/sprites/06-photographer-npc.png",
  engineer: "/media/pixel/sprites/07-engineer-npc.png",
  arcadeNpc: "/media/pixel/sprites/08-arcade-npc.png",
  evanSign: "/media/pixel/sprites/09-evan-web-sign.png",
  studio: "/media/pixel/sprites/10-studio-building.png",
  photoStudio: "/media/pixel/sprites/11-photo-studio-building.png",
  arcade: "/media/pixel/sprites/12-arcade-game-zone.png",
  cityA: "/media/pixel/sprites/14-city-building-a.png",
  cityB: "/media/pixel/sprites/15-city-building-b.png",
  cityC: "/media/pixel/sprites/16-city-building-c.png",
  desk: "/media/pixel/sprites/17-ultrawide-desk.png",
  dryCabinet: "/media/pixel/sprites/18-dry-cabinet.png",
  lensCabinet: "/media/pixel/sprites/19-lens-cabinet.png",
  photoWall: "/media/pixel/sprites/20-photo-wall.png",
  photoShootStudio: "/media/pixel/generated/photo-shoot-studio-integrated.png",
  newspaper: "/media/pixel/sprites/21-newspaper-stack.png",
  broadcastDesk: "/media/pixel/sprites/22-openclaw-broadcast-desk.png",
  arcadeMachine: "/media/pixel/sprites/23-arcade-machine.png",
  signpost: "/media/pixel/sprites/24-map-signpost.png",
  beijingBroadcastDistrict: "/media/pixel/sprites/37-beijing-broadcast-district.png",
  roadTile: "/media/pixel/tiles/25-night-road-tiles.png",
  mountainTile: "/media/pixel/tiles/26-mountain-boundary-tiles.png",
  grassTile: "/media/pixel/tiles/27-grass-border-tiles.png",
  interiorTile: "/media/pixel/tiles/28-interior-floor-tiles.png",
  lightOverlay: "/media/pixel/tiles/29-light-shadow-overlay.png",
};

const worldStats = [
  { label: "Nodes", value: "04" },
  { label: "Build", value: "Pixel" },
  { label: "Mode", value: "Explore" },
];

type PhotoAlbumCategoryId = "street" | "animals" | "architecture" | "stars" | "portraits";
type PhotoSourceCategory = "Street" | "Animal" | "Nature" | "Architecture" | "Portrait" | "Night" | "Astro";

type PhotoAlbumItem = {
  title: string;
  src: string;
  fullSrc: string;
  caption: string;
  meta: string;
  rotate: string;
};

type PhotoAlbumCategory = {
  id: PhotoAlbumCategoryId;
  wallLabel: string;
  tabLabel: string;
  description: string;
  coverSrc?: string;
  items: PhotoAlbumItem[];
};

type PhotoLibraryEntry = {
  code: string;
  caption: string;
  sourceCategories: PhotoSourceCategory[];
};

const photoLibrary: PhotoLibraryEntry[] = [
  { code: "DSC07507", caption: "Soft blossoms", sourceCategories: ["Nature"] },
  { code: "DSCF9124", caption: "Glass facade", sourceCategories: ["Architecture"] },
  { code: "DSCF9138", caption: "Clock tower", sourceCategories: ["Architecture"] },
  { code: "DSCF9146", caption: "Clock tower layers", sourceCategories: ["Architecture"] },
  { code: "DSCF9148", caption: "Urban canyon", sourceCategories: ["Architecture"] },
  { code: "DSCF9156", caption: "Covered arcade", sourceCategories: ["Architecture"] },
  { code: "DSCF9161", caption: "Interior scene", sourceCategories: ["Architecture"] },
  { code: "DSCF9162", caption: "Glass detail", sourceCategories: ["Architecture"] },
  { code: "DSCF9170", caption: "Light rail crossing", sourceCategories: ["Street", "Portrait"] },
  { code: "DSCF9172", caption: "Street portrait", sourceCategories: ["Street", "Portrait"] },
  { code: "DSCF9183", caption: "Facade rhythm", sourceCategories: ["Architecture"] },
  { code: "DSCF9186", caption: "Retail facade", sourceCategories: ["Architecture"] },
  { code: "DSCF9187", caption: "Street corner", sourceCategories: ["Street"] },
  { code: "P1032761", caption: "Underpass dusk", sourceCategories: ["Architecture"] },
  { code: "P1032762", caption: "Residential tower", sourceCategories: ["Architecture"] },
  { code: "P1032763", caption: "Glass reflection", sourceCategories: ["Architecture"] },
  { code: "P1032794", caption: "Night tram", sourceCategories: ["Street", "Night"] },
  { code: "P1033357", caption: "Shaded lane", sourceCategories: ["Street"] },
  { code: "P1033361", caption: "Tree canopy", sourceCategories: ["Nature"] },
  { code: "P1033380", caption: "Vertical city", sourceCategories: ["Architecture"] },
  { code: "P1033392", caption: "Looking up", sourceCategories: ["Architecture"] },
  { code: "P1033437", caption: "Window room", sourceCategories: ["Architecture"] },
  { code: "P1033598", caption: "Coastal tower", sourceCategories: ["Architecture"] },
  { code: "P1033646", caption: "Clouded coast", sourceCategories: ["Nature"] },
  { code: "P1034905", caption: "CBD shadow", sourceCategories: ["Street", "Architecture"] },
  { code: "P1034935", caption: "Tower glimpse", sourceCategories: ["Architecture"] },
  { code: "P1034944", caption: "Archway", sourceCategories: ["Architecture"] },
  { code: "P1035358", caption: "Harbour gull", sourceCategories: ["Animal", "Nature"] },
  { code: "P1035420", caption: "Sun through trees", sourceCategories: ["Nature"] },
  { code: "P1035455", caption: "Late city light", sourceCategories: ["Architecture"] },
  { code: "P1035457", caption: "Pedestrian corner", sourceCategories: ["Street", "Portrait"] },
  { code: "P1035469", caption: "Stair geometry", sourceCategories: ["Architecture"] },
];

const photoMetaByCode: Record<string, string> = {
  DSC07507: "EXIF 待补",
  DSCF9124: "135mm · f/3.5 · 1/500s · ISO 400",
  DSCF9138: "135mm · f/3.5 · 1/250s · ISO 800",
  DSCF9146: "135mm · f/3.5 · 1/1000s · ISO 200",
  DSCF9148: "135mm · f/3.5 · 1/400s · ISO 400",
  DSCF9156: "135mm · f/3.5 · 1/800s · ISO 100",
  DSCF9161: "135mm · f/3.5 · 1/125s · ISO 1600",
  DSCF9162: "135mm · f/3.5 · 1/2000s · ISO 400",
  DSCF9170: "135mm · f/3.5 · 1/500s · ISO 200",
  DSCF9172: "135mm · f/3.5 · 1/640s · ISO 400",
  DSCF9183: "135mm · f/3.5 · 1/1000s · ISO 200",
  DSCF9186: "135mm · f/3.5 · 1/250s · ISO 800",
  DSCF9187: "135mm · f/3.5 · 1/400s · ISO 400",
  P1032761: "75mm · f/2.2 · 1/8000s · ISO 5000",
  P1032762: "75mm · f/2.2 · 1/8000s · ISO 5000",
  P1032763: "75mm · f/2.2 · 1/6400s · ISO 5000",
  P1032794: "75mm · f/2.0 · 1/250s · ISO 1000",
  P1033357: "50mm · 1/20s · ISO 640",
  P1033361: "50mm · 1/13s · ISO 640",
  P1033380: "20mm · f/4.0 · 1/1000s · ISO 640",
  P1033392: "20mm · f/4.0 · 1/1000s · ISO 640",
  P1033437: "103mm · f/6.2 · 1/13s · ISO 640",
  P1033598: "200mm · f/6.3 · 1/4000s · ISO 640",
  P1033646: "21mm · f/6.3 · 1/3200s · ISO 640",
  P1034905: "43mm · f/5.1 · 1/2000s · ISO 640",
  P1034935: "200mm · f/6.3 · 1/1600s · ISO 400",
  P1034944: "64mm · f/5.6 · 1/80s · ISO 2000",
  P1035358: "400mm · f/6.3 · 1/1600s · ISO 640",
  P1035420: "100mm · f/5.9 · 1/400s · ISO 640",
  P1035455: "40mm · f/2.0 · 1/3200s · ISO 100",
  P1035457: "40mm · f/2.0 · 1/125s · ISO 100",
  P1035469: "40mm · f/2.0 · 1/6400s · ISO 100",
};

const albumCategoryConfigs: Array<{
  id: PhotoAlbumCategoryId;
  wallLabel: string;
  tabLabel: string;
  description: string;
  sourceCategories: PhotoSourceCategory[];
}> = [
  {
    id: "street",
    wallLabel: "街拍",
    tabLabel: "街拍",
    description: "从原始摄影数据里读取 Street 分类。",
    sourceCategories: ["Street"],
  },
  {
    id: "animals",
    wallLabel: "动物摄影",
    tabLabel: "动物",
    description: "只放动物摄影，不混入街拍、建筑或风景。",
    sourceCategories: ["Animal"],
  },
  {
    id: "architecture",
    wallLabel: "建筑",
    tabLabel: "建筑",
    description: "只放 Architecture 分类里的建筑和结构照片。",
    sourceCategories: ["Architecture"],
  },
  {
    id: "stars",
    wallLabel: "星空",
    tabLabel: "星空",
    description: "当前素材库没有星空作品，所以这里保持空状态。",
    sourceCategories: ["Astro"],
  },
  {
    id: "portraits",
    wallLabel: "人像",
    tabLabel: "人像",
    description: "只放 Portrait 分类里的人像照片。",
    sourceCategories: ["Portrait"],
  },
];

const albumRotations = ["-2.5deg", "1.4deg", "-1deg", "2.2deg", "-1.6deg", "1deg"];

function toPhotoSrc(code: string, size: "thumbs" | "full") {
  return `/media/photography/${size}/${code}.webp`;
}

function buildAlbumCategory(
  config: (typeof albumCategoryConfigs)[number],
): PhotoAlbumCategory {
  const items = photoLibrary
    .filter((photo) => photo.sourceCategories.some((sourceCategory) => config.sourceCategories.includes(sourceCategory)))
    .map((photo, index) => ({
      title: photo.code,
      caption: photo.caption,
      meta: photoMetaByCode[photo.code] ?? "镜头参数待补",
      src: toPhotoSrc(photo.code, "thumbs"),
      fullSrc: toPhotoSrc(photo.code, "full"),
      rotate: albumRotations[index % albumRotations.length],
    }));

  return {
    id: config.id,
    wallLabel: config.wallLabel,
    tabLabel: config.tabLabel,
    description: config.description,
    coverSrc: items[0]?.src,
    items,
  };
}

const photoAlbumCategories: PhotoAlbumCategory[] = albumCategoryConfigs.map(buildAlbumCategory);

type PhotoControlState = ControlState & {
  interact: boolean;
};

export default function PixelWorld() {
  const gameRef = useRef<HTMLDivElement | null>(null);
  const controlsRef = useRef<ControlState>({ up: false, down: false, left: false, right: false });
  const interactRef = useRef<() => void>(() => {});
  const skipIntroRef = useRef<() => void>(() => {});
  const [activePanel, setActivePanel] = useState<PanelId>(null);
  const [activeInterior, setActiveInterior] = useState<"photo" | null>(null);
  const [activeHotspot, setActiveHotspot] = useState<ActiveHotspot>(null);
  const [area, setArea] = useState("EVAN WEB 山顶");
  const [introDone, setIntroDone] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const clearControls = useCallback(() => {
    controlsRef.current.up = false;
    controlsRef.current.down = false;
    controlsRef.current.left = false;
    controlsRef.current.right = false;
  }, []);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("room") === "photo") {
      setActiveInterior("photo");
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActivePanel(null);
        setActiveInterior(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const releaseControls = () => clearControls();
    const releaseOnVisibility = () => {
      if (document.visibilityState === "hidden") {
        clearControls();
      }
    };

    window.addEventListener("pointerup", releaseControls);
    window.addEventListener("pointercancel", releaseControls);
    window.addEventListener("blur", releaseControls);
    document.addEventListener("visibilitychange", releaseOnVisibility);

    return () => {
      window.removeEventListener("pointerup", releaseControls);
      window.removeEventListener("pointercancel", releaseControls);
      window.removeEventListener("blur", releaseControls);
      document.removeEventListener("visibilitychange", releaseOnVisibility);
    };
  }, [clearControls]);

  useEffect(() => {
    const node = gameRef.current;
    if (!node) {
      return;
    }
    const parentNode = node;

    let destroyed = false;
    let game: { destroy: (removeCanvas: boolean, noReturn?: boolean) => void } | null = null;

    const bridge: SceneBridge = {
      controls: controlsRef.current,
      clearControls,
      openPanel: (panel) => {
        if (panel === "photo") {
          setActivePanel(null);
          setActiveInterior("photo");
          return;
        }
        setActivePanel(panel);
      },
      setHotspot: setActiveHotspot,
      setArea,
      setIntroDone,
      setInteract: (handler) => {
        interactRef.current = handler;
      },
      setSkipIntro: (handler) => {
        skipIntroRef.current = handler;
      },
      reducedMotion,
    };

    async function mountGame() {
      const PhaserModule = await import("phaser");
      if (destroyed) {
        return;
      }
      const Phaser = ((PhaserModule as unknown as { default?: typeof PhaserModule }).default ?? PhaserModule) as typeof PhaserModule;

      class EvanWebScene extends Phaser.Scene {
        player!: Phaser.Physics.Arcade.Sprite;
        blockers!: Phaser.Physics.Arcade.StaticGroup;
        cursors!: Record<string, Phaser.Input.Keyboard.Key>;
        nearest: ActiveHotspot = null;
        introLocked = true;
        insideStudio = false;
        wasMoving = false;
        facing: Facing = "down";
        lastHotspotId = "";
        lastArea = "";

        preload() {
          this.load.spritesheet("evanWalk", runtimeAssets.evanWalk, { frameWidth: 256, frameHeight: 256 });
          this.load.spritesheet("evanIdle", runtimeAssets.evanIdle, { frameWidth: 256, frameHeight: 256 });
          Object.entries(runtimeAssets).forEach(([key, path]) => {
            if (key !== "evanWalk" && key !== "evanIdle") {
              this.load.image(key, path);
            }
          });
        }

        create() {
          this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
          this.createMap();
          this.createAnimations();

          this.player = this.physics.add.sprite(1200, 1620, "evanIdle", directionFrames.down.idle);
          this.player.setScale(0.3);
          this.player.setDepth(1000);
          this.player.setCollideWorldBounds(true);
          this.player.body?.setSize(58, 68, true);
          this.player.body?.setOffset(100, 132);

          this.blockers = this.physics.add.staticGroup();
          this.createBlockers();
          this.physics.add.collider(this.player, this.blockers);

          this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
          this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
          this.cameras.main.setZoom(this.targetZoom());
          this.scale.on("resize", () => {
            this.cameras.main.setZoom(this.targetZoom());
          });

          this.cursors = this.input.keyboard?.addKeys({
            up: "W",
            down: "S",
            left: "A",
            right: "D",
            arrowUp: "UP",
            arrowDown: "DOWN",
            arrowLeft: "LEFT",
            arrowRight: "RIGHT",
            interact: "E",
          }) as Record<string, Phaser.Input.Keyboard.Key>;

          this.input.keyboard?.on("keydown-E", () => this.tryInteract());
          bridge.setInteract(() => this.tryInteract());
          bridge.setSkipIntro(() => this.skipIntro());

          const resetInput = () => this.resetMovementInput();
          const resetOnVisibility = () => {
            if (document.visibilityState === "hidden") {
              this.resetMovementInput();
            }
          };
          window.addEventListener("blur", resetInput);
          document.addEventListener("visibilitychange", resetOnVisibility);
          this.events.once("shutdown", () => {
            window.removeEventListener("blur", resetInput);
            document.removeEventListener("visibilitychange", resetOnVisibility);
          });

          this.cameras.main.fadeIn(650, 0, 0, 0);
          if (bridge.reducedMotion) {
            this.skipIntro();
          } else {
            this.runIntro();
          }
        }

        update(_time: number, delta: number) {
          this.updateArea();
          this.updateHotspot();

          if (this.introLocked) {
            this.player.setVelocity(0, 0);
            return;
          }

          const speed = 188;
          const maxDelta = Math.min(delta, 34) / 16.67;
          const keyboard = this.cursors;
          const mobile = bridge.controls;
          const left = keyboard.left?.isDown || keyboard.arrowLeft?.isDown || mobile.left;
          const right = keyboard.right?.isDown || keyboard.arrowRight?.isDown || mobile.right;
          const up = keyboard.up?.isDown || keyboard.arrowUp?.isDown || mobile.up;
          const down = keyboard.down?.isDown || keyboard.arrowDown?.isDown || mobile.down;
          let vx = 0;
          let vy = 0;

          if (left) vx -= 1;
          if (right) vx += 1;
          if (up) vy -= 1;
          if (down) vy += 1;

          if (vx !== 0 || vy !== 0) {
            const length = Math.hypot(vx, vy);
            const facing = this.directionFromVector(vx, vy);
            this.facing = facing;
            this.player.setVelocity((vx / length) * speed * maxDelta, (vy / length) * speed * maxDelta);
            this.player.setFlipX(false);
            this.player.anims.play(`walk-${facing}`, true);
            this.wasMoving = true;
          } else {
            this.stopPlayer();
          }
        }

        createMap() {
          this.add.tileSprite(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, WORLD_WIDTH, WORLD_HEIGHT, "roadTile").setAlpha(0.82);
          this.add.tileSprite(WORLD_WIDTH / 2, 120, WORLD_WIDTH, 260, "mountainTile").setAlpha(0.9);
          this.add.tileSprite(WORLD_WIDTH / 2, WORLD_HEIGHT - 120, WORLD_WIDTH, 240, "grassTile").setAlpha(0.62);

          this.add.rectangle(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, WORLD_WIDTH, WORLD_HEIGHT, 0x24323a, 0.12);
          this.createRoadNetwork();
          this.createSkylineLayer();
          this.add.rectangle(1200, 820, 920, 460, 0x241a0d, 0.42).setStrokeStyle(4, 0xffd166, 0.28);
          this.add.tileSprite(1850, 405, 520, 360, "interiorTile").setAlpha(0.55).setDepth(20);
          this.add.tileSprite(470, 405, 540, 360, "interiorTile").setAlpha(0.45).setDepth(20);
          this.add.tileSprite(520, 1390, 520, 360, "interiorTile").setAlpha(0.42).setDepth(20);
          this.add.tileSprite(1840, 1400, 560, 390, "interiorTile").setAlpha(0.38).setDepth(20);
          this.createPlazaInlays();

          [
            [410, 520, 0xffd166, 210, 0.22],
            [650, 460, 0xffd166, 170, 0.2],
            [1760, 510, 0x67e8f9, 220, 0.26],
            [1960, 440, 0xffd166, 190, 0.19],
            [1200, 705, 0xffd166, 360, 0.24],
            [980, 1000, 0xffd166, 180, 0.14],
            [1420, 1000, 0x67e8f9, 190, 0.14],
            [520, 1370, 0xff5b57, 230, 0.18],
            [630, 1490, 0x67e8f9, 170, 0.16],
            [1805, 1325, 0x67e8f9, 220, 0.18],
            [2065, 1510, 0xffd166, 140, 0.11],
            [1605, 1510, 0x67e8f9, 130, 0.1],
          ].forEach(([x, y, color, radius, alpha]) => this.createLightPool(x, y, color, radius, alpha));

          this.add.image(1200, 760, "evanSign").setScale(0.46).setDepth(90);
          this.add.image(1850, 360, "studio").setScale(0.32).setDepth(70);
          this.add
            .image(470, 360, "photoStudio")
            .setScale(0.32)
            .setDepth(70)
            .setInteractive({ useHandCursor: true })
            .on("pointerdown", () => bridge.openPanel("photo"));
          this.add.image(520, 1350, "arcade").setScale(0.34).setDepth(70);
          this.add.image(2110, 1515, "cityC").setScale(0.14).setAlpha(0.72).setDepth(48);
          this.add.image(2245, 1585, "cityB").setScale(0.12).setAlpha(0.58).setDepth(46);

          this.add.image(1848, 540, "desk").setScale(0.15).setDepth(82);
          this.add.image(590, 1478, "arcadeMachine").setScale(0.14).setDepth(83);
          this.add.image(1200, 1085, "signpost").setScale(0.12).setDepth(84);

          this.add.image(350, 430, "photographer").setScale(0.08).setDepth(92);
          this.add.image(1720, 450, "engineer").setScale(0.08).setDepth(92);
          this.add.image(690, 1320, "arcadeNpc").setScale(0.08).setDepth(92);
          this.add.image(1360, 1030, "visitor").setScale(0.08).setDepth(92);
          this.createDistrictDecor();
          this.createCityIdentityCorner();

          this.createLabel(1200, 560, "E V A N  W E B", 34, "#ffd166");
          this.createLabel(1850, 160, "STUDIO", 18, "#67e8f9");
          this.createLabel(1810, 610, "ENTER", 14, "#fff7db");
          this.createLabel(470, 150, "PHOTO LAB", 18, "#ffd166");
          this.createLabel(470, 610, "ENTER", 14, "#fff7db");
          this.createLabel(520, 1140, "GAME ZONE", 18, "#ff5b57");
          this.createLabel(1840, 1458, "OPENCLAW TOWER", 18, "#67e8f9");

          this.add.rectangle(1120, 925, 18, 360, 0xffd166, 0.3).setAngle(-24).setDepth(15);
          this.add.rectangle(1280, 925, 18, 360, 0xffd166, 0.3).setAngle(24).setDepth(15);
          this.add.rectangle(1840, 1250, 16, 420, 0x67e8f9, 0.2).setAngle(-12).setDepth(15);
          this.add.tileSprite(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, WORLD_WIDTH, WORLD_HEIGHT, "lightOverlay").setAlpha(0.24).setDepth(1100);
        }

        createSkylineLayer() {
          const buildingRows: Array<[number, number, number, number, number, number]> = [
            [78, 210, 96, 128, 0x0b1117, 0.7],
            [206, 188, 72, 96, 0x101821, 0.6],
            [2140, 214, 86, 150, 0x0d141b, 0.58],
            [2256, 196, 118, 118, 0x111923, 0.54],
            [72, 1664, 126, 176, 0x091015, 0.72],
            [218, 1700, 94, 132, 0x0e151c, 0.62],
            [2144, 1660, 102, 154, 0x0b1117, 0.66],
            [2282, 1694, 82, 124, 0x111923, 0.58],
          ];

          buildingRows.forEach(([x, y, width, height, color, alpha], index) => {
            this.add.rectangle(x, y, width, height, color, alpha).setDepth(9);
            this.add.rectangle(x, y - height / 2 - 5, width + 10, 10, 0x17222b, alpha * 0.8).setDepth(10);
            for (let row = 0; row < 3; row += 1) {
              for (let col = 0; col < 3; col += 1) {
                if ((row + col + index) % 2 === 0) {
                  this.add
                    .rectangle(x - width / 3 + col * (width / 3), y - height / 4 + row * 32, 8, 12, 0xffd166, 0.28)
                    .setDepth(11);
                }
              }
            }
          });
        }

        createPlazaInlays() {
          const inlay = this.add.graphics().setDepth(16);
          inlay.lineStyle(2, 0xffd166, 0.16);
          [
            [790, 635, 820, 350],
            [865, 700, 670, 220],
            [1015, 760, 370, 96],
            [1565, 232, 560, 344],
            [226, 232, 488, 344],
            [275, 1232, 500, 300],
            [1570, 1222, 540, 326],
          ].forEach(([x, y, width, height]) => {
            inlay.strokeRect(x, y, width, height);
          });

          inlay.lineStyle(1, 0x67e8f9, 0.12);
          for (let x = 860; x <= 1520; x += 96) {
            inlay.lineBetween(x, 705, x, 900);
          }
          for (let y = 710; y <= 900; y += 48) {
            inlay.lineBetween(860, y, 1540, y);
          }
        }

        createDistrictDecor() {
          const lamps: Array<[number, number, number]> = [
            [990, 610, 0xffd166],
            [1410, 610, 0xffd166],
            [990, 1015, 0x67e8f9],
            [1410, 1015, 0x67e8f9],
            [300, 675, 0xffd166],
            [645, 675, 0xffd166],
            [1645, 650, 0x67e8f9],
            [2055, 650, 0x67e8f9],
            [365, 1195, 0xff5b57],
            [690, 1195, 0xff5b57],
            [1040, 1188, 0xffd166],
            [1360, 1188, 0x67e8f9],
            [1040, 1468, 0x67e8f9],
            [1360, 1468, 0xffd166],
            [1650, 1165, 0x67e8f9],
            [2030, 1165, 0xffd166],
          ];
          lamps.forEach(([x, y, color]) => this.createStreetLamp(x, y, color));

          this.createFenceLine(782, 575, 9, "horizontal");
          this.createFenceLine(1506, 575, 7, "horizontal");
          this.createFenceLine(248, 665, 9, "horizontal");
          this.createFenceLine(1608, 710, 10, "horizontal");
          this.createFenceLine(264, 1198, 8, "horizontal");
          this.createFenceLine(1600, 1168, 9, "horizontal");

          [
            [890, 1072, 72, 0x77ffab],
            [1510, 1072, 72, 0x77ffab],
            [308, 820, 82, 0xffd166],
            [642, 824, 72, 0x67e8f9],
            [1602, 820, 84, 0x67e8f9],
            [2090, 816, 76, 0xffd166],
            [302, 1558, 88, 0xff5b57],
            [746, 1542, 76, 0xffd166],
            [1025, 1328, 74, 0xffd166],
            [1375, 1328, 74, 0x67e8f9],
            [1000, 1588, 88, 0x67e8f9],
            [1400, 1588, 88, 0xffd166],
            [1592, 1546, 80, 0x67e8f9],
            [2042, 1588, 86, 0xffd166],
          ].forEach(([x, y, width, color]) => this.createPixelPlanter(x, y, width, color));

          const kiosks: Array<[number, number, string, number]> = [
            [1668, 572, "BUILD", 0x67e8f9],
            [1960, 575, "SHIP", 0xffd166],
            [300, 552, "SHOT", 0xffd166],
            [642, 552, "RAW", 0x67e8f9],
            [342, 1508, "PLAY", 0xff5b57],
            [734, 1500, "COIN", 0xffd166],
            [1040, 1260, "LOG", 0xffd166],
            [1360, 1260, "LINK", 0x67e8f9],
            [1040, 1522, "MAP", 0x67e8f9],
            [1360, 1522, "SYNC", 0xffd166],
            [1638, 1490, "LIVE", 0x67e8f9],
            [1998, 1498, "NEWS", 0xffd166],
          ];
          kiosks.forEach(([x, y, label, color]) => this.createTerminalKiosk(x, y, label, color));

          this.createCableRun([
            [1660, 565],
            [1768, 625],
            [1848, 540],
            [1988, 622],
            [2070, 560],
          ], 0x67e8f9);
          this.createCableRun([
            [330, 1470],
            [455, 1510],
            [590, 1478],
            [725, 1518],
          ], 0xff5b57);
          this.createCableRun([
            [1040, 1260],
            [1138, 1320],
            [1200, 1435],
            [1262, 1320],
            [1360, 1260],
          ], 0xffd166);
          this.createCableRun([
            [1040, 1522],
            [1130, 1570],
            [1200, 1618],
            [1270, 1570],
            [1360, 1522],
          ], 0x67e8f9);
          this.createCableRun([
            [1626, 1488],
            [1768, 1420],
            [1840, 1280],
            [1995, 1450],
          ], 0x67e8f9);

          [
            [858, 825, 0xffd166],
            [932, 825, 0x67e8f9],
            [1006, 825, 0xffd166],
            [1394, 825, 0xffd166],
            [1468, 825, 0x67e8f9],
            [1542, 825, 0xffd166],
            [1160, 638, 0xffd166],
            [1240, 638, 0xffd166],
            [1160, 1012, 0x67e8f9],
            [1240, 1012, 0x67e8f9],
            [1100, 1180, 0xffd166],
            [1300, 1180, 0x67e8f9],
            [1100, 1370, 0x67e8f9],
            [1300, 1370, 0xffd166],
            [1100, 1560, 0x67e8f9],
            [1300, 1560, 0xffd166],
          ].forEach(([x, y, color]) => this.createGroundMarker(x, y, color));
        }

        createStreetLamp(x: number, y: number, color: number) {
          this.createLightPool(x, y + 20, color, 72, 0.08);
          this.add.rectangle(x, y + 18, 8, 52, 0x0b0c0f, 0.92).setDepth(62);
          this.add.rectangle(x, y - 12, 30, 8, 0x15181d, 0.96).setDepth(63);
          this.add.rectangle(x, y - 6, 18, 14, color, 0.9).setDepth(64);
          this.add.rectangle(x, y + 46, 26, 8, 0x050607, 0.86).setDepth(62);
        }

        createPixelPlanter(x: number, y: number, width: number, accent: number) {
          this.add.rectangle(x, y, width, 28, 0x10151a, 0.92).setDepth(55).setStrokeStyle(2, accent, 0.34);
          this.add.rectangle(x, y - 9, width - 12, 8, 0x1e3328, 0.92).setDepth(56);
          for (let offset = -width / 2 + 14; offset < width / 2 - 8; offset += 18) {
            this.add.rectangle(x + offset, y - 18, 12, 16, 0x77ffab, 0.58).setDepth(57);
          }
        }

        createTerminalKiosk(x: number, y: number, label: string, accent: number) {
          this.add.rectangle(x, y, 64, 50, 0x0a0d11, 0.94).setDepth(74).setStrokeStyle(2, accent, 0.52);
          this.add.rectangle(x, y - 10, 42, 18, accent, 0.24).setDepth(75);
          this.add.rectangle(x - 16, y + 14, 8, 8, 0xffd166, 0.82).setDepth(75);
          this.add.rectangle(x, y + 14, 8, 8, 0x67e8f9, 0.82).setDepth(75);
          this.add.rectangle(x + 16, y + 14, 8, 8, 0xff5b57, 0.82).setDepth(75);
          this.add
            .text(x, y + 40, label, {
              fontFamily: "monospace",
              fontSize: "11px",
              color: "#fff7db",
              stroke: "#000000",
              strokeThickness: 4,
            })
            .setOrigin(0.5)
            .setDepth(76);
        }

        createFenceLine(x: number, y: number, count: number, orientation: "horizontal" | "vertical") {
          for (let index = 0; index < count; index += 1) {
            const px = orientation === "horizontal" ? x + index * 38 : x;
            const py = orientation === "vertical" ? y + index * 38 : y;
            this.add.rectangle(px, py, 8, 28, 0x0b0d10, 0.86).setDepth(50);
            if (orientation === "horizontal") {
              this.add.rectangle(px + 18, py - 2, 36, 5, 0xffd166, 0.22).setDepth(49);
            } else {
              this.add.rectangle(px - 2, py + 18, 5, 36, 0xffd166, 0.22).setDepth(49);
            }
          }
        }

        createCableRun(points: Array<[number, number]>, color: number) {
          const cable = this.add.graphics().setDepth(58);
          cable.lineStyle(4, color, 0.24);
          cable.beginPath();
          cable.moveTo(points[0][0], points[0][1]);
          points.slice(1).forEach(([x, y]) => cable.lineTo(x, y));
          cable.strokePath();

          points.forEach(([x, y]) => {
            this.add.rectangle(x, y, 14, 14, 0x050607, 0.82).setDepth(59).setStrokeStyle(2, color, 0.42);
          });
        }

        createGroundMarker(x: number, y: number, color: number) {
          this.add.rectangle(x, y, 44, 8, color, 0.28).setDepth(28);
          this.add.rectangle(x, y + 18, 18, 8, color, 0.18).setDepth(28);
          this.add.rectangle(x, y - 18, 18, 8, color, 0.18).setDepth(28);
        }

        createCityIdentityCorner() {
          this.add.image(1810, 1074, "beijingBroadcastDistrict").setScale(0.54).setDepth(78);
          this.createLightPool(1670, 1125, 0xffd166, 260, 0.12);
          this.createLightPool(2055, 1110, 0x67e8f9, 260, 0.16);
          this.createLightPool(2170, 1010, 0x67e8f9, 180, 0.14);
          this.createLightPool(1810, 1360, 0xffd166, 190, 0.1);
        }

        createRoadNetwork() {
          const road = this.add.graphics().setDepth(13);
          const segments = [
            [1110, 540, 180, 830],
            [385, 880, 1610, 140],
            [400, 520, 140, 830],
            [450, 1240, 1420, 140],
            [1720, 480, 150, 850],
            [470, 505, 760, 116],
            [1765, 505, 230, 116],
          ];

          road.fillStyle(0x0c1218, 0.78);
          segments.forEach(([x, y, width, height]) => {
            road.fillRect(x, y, width, height);
          });

          road.lineStyle(3, 0xf8c35f, 0.16);
          segments.forEach(([x, y, width, height]) => {
            road.strokeRect(x, y, width, height);
          });

          road.lineStyle(4, 0xf6e6aa, 0.18);
          for (let y = 600; y < 1320; y += 110) {
            road.lineBetween(1198, y, 1198, y + 42);
          }
          for (let x = 470; x < 1880; x += 135) {
            road.lineBetween(x, 950, x + 58, 950);
          }
          for (let y = 560; y < 1260; y += 120) {
            road.lineBetween(470, y, 470, y + 48);
          }
          for (let y = 560; y < 1260; y += 120) {
            road.lineBetween(1795, y, 1795, y + 48);
          }
        }

        createLightPool(x: number, y: number, color: number, radius: number, alpha: number) {
          const glow = this.add.graphics().setDepth(18);
          glow.fillStyle(color, alpha * 0.32);
          glow.fillCircle(x, y, radius);
          glow.fillStyle(color, alpha);
          glow.fillCircle(x, y, radius * 0.42);
        }

        createAnimations() {
          (Object.entries(directionFrames) as Array<[Facing, (typeof directionFrames)[Facing]]>).forEach(
            ([direction, frames]) => {
              this.anims.create({
                key: `walk-${direction}`,
                frames: this.anims.generateFrameNumbers("evanWalk", {
                  start: frames.walkStart,
                  end: frames.walkEnd,
                }),
                frameRate: 8,
                repeat: -1,
              });
            },
          );
        }

        directionFromVector(vx: number, vy: number): Facing {
          if (Math.abs(vx) > Math.abs(vy)) {
            return vx > 0 ? "right" : "left";
          }

          return vy < 0 ? "up" : "down";
        }

        createLabel(x: number, y: number, text: string, size: number, color: string) {
          this.add
            .text(x, y, text, {
              fontFamily: "monospace",
              fontSize: `${size}px`,
              color,
              stroke: "#000000",
              strokeThickness: 6,
            })
            .setOrigin(0.5)
            .setDepth(100);
        }

        createBlockers() {
          [
            [1200, 770, 790, 250],
            [1850, 230, 390, 90],
            [1625, 390, 38, 230],
            [2075, 390, 38, 230],
            [470, 360, 430, 310],
            [520, 1350, 460, 300],
            [1810, 1085, 820, 470],
            [2110, 1515, 240, 200],
            [2245, 1585, 220, 240],
            [1200, 120, WORLD_WIDTH, 130],
          ].forEach(([x, y, w, h]) => {
            const block = this.add.rectangle(x, y, w, h, 0x000000, 0);
            this.physics.add.existing(block, true);
            this.blockers.add(block);
          });
        }

        runIntro() {
          this.introLocked = true;
          bridge.setIntroDone(false);
          this.player.setPosition(1200, 1620);
          this.facing = "up";
          this.player.anims.play("walk-up", true);
          this.cameras.main.setZoom(this.introZoom());
          this.tweens.add({
            targets: this.player,
            y: 980,
            duration: 2500,
            ease: "Sine.easeInOut",
            onComplete: () => {
              this.introLocked = false;
              this.stopPlayer();
              bridge.setIntroDone(true);
              this.tweens.add({
                targets: this.cameras.main,
                zoom: this.targetZoom(),
                duration: 700,
                ease: "Sine.easeOut",
              });
            },
          });
        }

        skipIntro() {
          this.tweens.killTweensOf(this.player);
          this.introLocked = false;
          this.player.setPosition(1200, 980);
          this.stopPlayer();
          this.cameras.main.setZoom(this.targetZoom());
          bridge.setIntroDone(true);
        }

        targetZoom() {
          return this.scale.width < 700 ? MOBILE_CAMERA_ZOOM : DESKTOP_CAMERA_ZOOM;
        }

        introZoom() {
          return this.scale.width < 700 ? MOBILE_INTRO_ZOOM : DESKTOP_INTRO_ZOOM;
        }

        interiorZoom() {
          return this.scale.width < 700 ? MOBILE_INTERIOR_ZOOM : DESKTOP_INTERIOR_ZOOM;
        }

        updateHotspot() {
          let nearest: ActiveHotspot = null;
          let nearestDistance = Number.POSITIVE_INFINITY;
          for (const hotspot of worldHotspots) {
            const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, hotspot.x, hotspot.y);
            if (distance < hotspot.radius && distance < nearestDistance) {
              nearestDistance = distance;
              const action =
                hotspot.id === "studio" && this.insideStudio ? "打开带鱼屏项目终端" : hotspot.action;
              nearest = {
                id: hotspot.id,
                label: hotspot.label,
                action,
              };
            }
          }

          const nextId = nearest ? nearest.id : "";
          if (nextId !== this.lastHotspotId) {
            this.lastHotspotId = nextId;
            this.nearest = nearest;
            bridge.setHotspot(nearest);
          }
        }

        updateArea() {
          const point = { x: this.player.x, y: this.player.y };
          if (this.insideStudio && !this.isInsideStudio(point.x, point.y)) {
            this.insideStudio = false;
            this.lastHotspotId = "";
            this.cameras.main.setZoom(this.targetZoom());
          }

          let nextArea = "EVAN WEB 山顶";
          if (this.insideStudio) nextArea = "Evan Studio 内部";
          else if (point.x < 900 && point.y < 800) nextArea = "摄影工作室";
          else if (point.x > 1450 && point.y < 800) nextArea = "Evan Studio";
          if (point.x < 900 && point.y > 1060) nextArea = "互动小游戏";
          if (point.x > 1450 && point.y > 900) nextArea = "OpenClaw 电视塔";
          if (nextArea !== this.lastArea) {
            this.lastArea = nextArea;
            bridge.setArea(nextArea);
          }
        }

        tryInteract() {
          this.resetMovementInput();
          if (this.nearest) {
            if (this.nearest.id === "studio" && !this.insideStudio) {
              this.enterStudio();
              return;
            }
            bridge.openPanel(this.nearest.id);
          }
        }

        enterStudio() {
          this.insideStudio = true;
          this.lastHotspotId = "";
          this.player.setPosition(1848, 585);
          this.stopPlayer();
          this.cameras.main.setZoom(this.interiorZoom());
          bridge.setArea("Evan Studio 内部");
          bridge.setHotspot({
            id: "studio",
            label: "Evan Studio",
            action: "打开带鱼屏项目终端",
          });
        }

        isInsideStudio(x: number, y: number) {
          return x > 1540 && x < 2150 && y > 150 && y < 760;
        }

        resetMovementInput() {
          bridge.clearControls();
          this.input.keyboard?.resetKeys();
          this.stopPlayer();
        }

        stopPlayer() {
          this.player.setVelocity(0, 0);
          if (this.wasMoving || this.player.anims.isPlaying) {
            this.player.anims.stop();
            this.player.setTexture("evanIdle", directionFrames[this.facing].idle);
            this.wasMoving = false;
          }
        }
      }

      game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: parentNode,
        width: parentNode.clientWidth || 1280,
        height: parentNode.clientHeight || 720,
        backgroundColor: "#050505",
        pixelArt: true,
        roundPixels: true,
        scale: {
          mode: Phaser.Scale.RESIZE,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        physics: {
          default: "arcade",
          arcade: {
            debug: false,
          },
        },
        scene: EvanWebScene,
      });
    }

    mountGame();

    return () => {
      destroyed = true;
      game?.destroy(true);
    };
  }, [clearControls, reducedMotion]);

  const setMobileControl = useCallback((key: keyof ControlState, value: boolean) => {
    controlsRef.current[key] = value;
  }, []);

  const pressControl = useCallback(
    (key: keyof ControlState, event: PointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
      if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.setPointerCapture(event.pointerId);
      }
      setMobileControl(key, true);
    },
    [setMobileControl],
  );

  const releaseControl = useCallback(
    (key: keyof ControlState, event?: PointerEvent<HTMLButtonElement>) => {
      if (event) {
        event.preventDefault();
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }
      }
      setMobileControl(key, false);
    },
    [setMobileControl],
  );

  const openPanel = useCallback((panel: HotspotId) => {
    if (panel === "photo") {
      setActivePanel(null);
      setActiveInterior("photo");
      return;
    }

    setActivePanel(panel);
  }, []);

  const panelTitle = useMemo(() => {
    if (activePanel === "studio") return "Evan Studio";
    if (activePanel === "photo") return "摄影工作室";
    if (activePanel === "game") return "互动小游戏";
    if (activePanel === "broadcast") return "OpenClaw 电视塔";
    return "";
  }, [activePanel]);

  return (
    <main className="evan-shell">
      <div ref={gameRef} className="game-stage" />
      <div className="crt-layer" />

      <header className="top-hud">
        <div className="hud-chip" aria-live="polite">
          <div className="hud-kicker">EVAN WEB</div>
          <div className="hud-title">{area}</div>
        </div>
        <nav className="hud-nav" aria-label="Map shortcuts">
          {worldHotspots.map((hotspot) => (
            <button key={hotspot.id} className="hud-button" onClick={() => openPanel(hotspot.id)}>
              {hotspot.label}
            </button>
          ))}
        </nav>
      </header>

      <div className="toast">这是 Evan Web，尽情探索吧。WASD 移动，靠近建筑按 E 互动。</div>

      <section className="world-dashboard" aria-label="World status">
        <div className="dashboard-kicker">LIVE WORLD</div>
        <div className="dashboard-title">Evan Studio map</div>
        <div className="dashboard-stats">
          {worldStats.map((stat) => (
            <div key={stat.label}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </div>
          ))}
        </div>
      </section>

      <aside className="district-rail" aria-label="探索节点状态">
        <div className="dashboard-kicker">DISTRICTS</div>
        {worldHotspots.map((hotspot, index) => (
          <div className={activeHotspot?.id === hotspot.id ? "district-item active" : "district-item"} key={hotspot.id}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <strong>{hotspot.label}</strong>
              <small>{hotspot.action}</small>
            </div>
          </div>
        ))}
      </aside>

      {!introDone && (
        <button className="hud-button skip-intro" onClick={() => skipIntroRef.current()}>
          Skip Intro
        </button>
      )}

      {activeHotspot && !activePanel && (
        <div className="prompt">
          靠近 <strong>{activeHotspot.label}</strong>，按 <strong>E</strong> {activeHotspot.action}
        </div>
      )}

      <div className="mobile-pad" aria-label="Mobile movement controls">
        <button
          className="up"
          onPointerDown={(event) => pressControl("up", event)}
          onPointerUp={(event) => releaseControl("up", event)}
          onPointerCancel={(event) => releaseControl("up", event)}
          onLostPointerCapture={() => setMobileControl("up", false)}
          onBlur={() => setMobileControl("up", false)}
        >
          W
        </button>
        <button
          className="left"
          onPointerDown={(event) => pressControl("left", event)}
          onPointerUp={(event) => releaseControl("left", event)}
          onPointerCancel={(event) => releaseControl("left", event)}
          onLostPointerCapture={() => setMobileControl("left", false)}
          onBlur={() => setMobileControl("left", false)}
        >
          A
        </button>
        <button
          className="down"
          onPointerDown={(event) => pressControl("down", event)}
          onPointerUp={(event) => releaseControl("down", event)}
          onPointerCancel={(event) => releaseControl("down", event)}
          onLostPointerCapture={() => setMobileControl("down", false)}
          onBlur={() => setMobileControl("down", false)}
        >
          S
        </button>
        <button
          className="right"
          onPointerDown={(event) => pressControl("right", event)}
          onPointerUp={(event) => releaseControl("right", event)}
          onPointerCancel={(event) => releaseControl("right", event)}
          onLostPointerCapture={() => setMobileControl("right", false)}
          onBlur={() => setMobileControl("right", false)}
        >
          D
        </button>
      </div>
      <button className="mobile-action" onClick={() => interactRef.current()}>
        E
      </button>

      {activePanel && (
        <PanelOverlay title={panelTitle} panel={activePanel} onClose={() => setActivePanel(null)} />
      )}

      {activeInterior === "photo" && <PhotoLabInterior onBack={() => setActiveInterior(null)} />}
    </main>
  );
}

function PhotoLabInterior({ onBack }: { onBack: () => void }) {
  const roomRef = useRef<HTMLDivElement | null>(null);
  const controlsRef = useRef<PhotoControlState>({
    up: false,
    down: false,
    left: false,
    right: false,
    interact: false,
  });
  const albumOpenRef = useRef(false);
  const lightboxOpenRef = useRef(false);
  const bookingOpenRef = useRef(false);
  const [activeAlbumCategoryId, setActiveAlbumCategoryId] = useState<PhotoAlbumCategoryId | null>(null);
  const [activeLightboxPhoto, setActiveLightboxPhoto] = useState<PhotoAlbumItem | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);

  const setControl = useCallback((key: keyof PhotoControlState, value: boolean) => {
    controlsRef.current[key] = value;
  }, []);

  const clearPhotoControls = useCallback(() => {
    controlsRef.current.up = false;
    controlsRef.current.down = false;
    controlsRef.current.left = false;
    controlsRef.current.right = false;
    controlsRef.current.interact = false;
  }, []);

  const closeAlbum = useCallback(() => {
    setActiveAlbumCategoryId(null);
    setActiveLightboxPhoto(null);
    clearPhotoControls();
  }, [clearPhotoControls]);

  const openAlbum = useCallback((categoryId: PhotoAlbumCategoryId) => {
    setActiveAlbumCategoryId(categoryId);
    setBookingOpen(false);
    clearPhotoControls();
  }, [clearPhotoControls]);

  const closeLightbox = useCallback(() => {
    setActiveLightboxPhoto(null);
    clearPhotoControls();
  }, [clearPhotoControls]);

  const openBooking = useCallback(() => {
    setActiveAlbumCategoryId(null);
    setActiveLightboxPhoto(null);
    setBookingOpen(true);
    clearPhotoControls();
  }, [clearPhotoControls]);

  const closeBooking = useCallback(() => {
    setBookingOpen(false);
    clearPhotoControls();
  }, [clearPhotoControls]);

  useEffect(() => {
    albumOpenRef.current = activeAlbumCategoryId !== null;
  }, [activeAlbumCategoryId]);

  useEffect(() => {
    lightboxOpenRef.current = activeLightboxPhoto !== null;
  }, [activeLightboxPhoto]);

  useEffect(() => {
    bookingOpenRef.current = bookingOpen;
  }, [bookingOpen]);

  useEffect(() => {
    const setKeyState = (event: KeyboardEvent, value: boolean) => {
      if (lightboxOpenRef.current) {
        if (event.key === "Escape" && value && !event.repeat) {
          closeLightbox();
          event.preventDefault();
          event.stopImmediatePropagation();
        }
        return;
      }

      if (albumOpenRef.current) {
        if (event.key === "Escape" && value && !event.repeat) {
          closeAlbum();
          event.preventDefault();
          event.stopImmediatePropagation();
        }
        return;
      }

      if (bookingOpenRef.current) {
        if (event.key === "Escape" && value && !event.repeat) {
          closeBooking();
          event.preventDefault();
          event.stopImmediatePropagation();
        }
        return;
      }

      const key = event.key.toLowerCase();
      let handled = true;

      if (key === "w" || key === "arrowup") {
        controlsRef.current.up = value;
      } else if (key === "s" || key === "arrowdown") {
        controlsRef.current.down = value;
      } else if (key === "a" || key === "arrowleft") {
        controlsRef.current.left = value;
      } else if (key === "d" || key === "arrowright") {
        controlsRef.current.right = value;
      } else if ((key === "e" || key === "enter" || event.key === " ") && value && !event.repeat) {
        controlsRef.current.interact = true;
      } else {
        handled = false;
      }

      if (handled) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };

    const onKeyDown = (event: KeyboardEvent) => setKeyState(event, true);
    const onKeyUp = (event: KeyboardEvent) => setKeyState(event, false);
    const releaseControls = () => clearPhotoControls();
    const releaseOnVisibility = () => {
      if (document.visibilityState === "hidden") {
        clearPhotoControls();
      }
    };

    window.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("keyup", onKeyUp, true);
    window.addEventListener("blur", releaseControls);
    document.addEventListener("visibilitychange", releaseOnVisibility);

    return () => {
      window.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("keyup", onKeyUp, true);
      window.removeEventListener("blur", releaseControls);
      document.removeEventListener("visibilitychange", releaseOnVisibility);
      clearPhotoControls();
    };
  }, [clearPhotoControls, closeAlbum, closeBooking, closeLightbox]);

  useEffect(() => {
    const node = roomRef.current;
    if (!node) {
      return;
    }
    const parentNode = node;

    let destroyed = false;
    let game: { destroy: (removeCanvas: boolean, noReturn?: boolean) => void } | null = null;

    async function mountPhotoRoom() {
      const PhaserModule = await import("phaser");
      if (destroyed) {
        return;
      }
      const Phaser = ((PhaserModule as unknown as { default?: typeof PhaserModule }).default ?? PhaserModule) as typeof PhaserModule;

      class PhotoInteriorScene extends Phaser.Scene {
        player!: Phaser.Physics.Arcade.Sprite;
        blockers!: Phaser.Physics.Arcade.StaticGroup;
        promptText!: Phaser.GameObjects.Text;
        selectedTitle!: Phaser.GameObjects.Text;
        previewImage!: Phaser.GameObjects.Image;
        bookingMarker!: Phaser.GameObjects.Rectangle;
        activeIndex = 0;
        facing: Facing = "down";
        wasMoving = false;
        nearestIndex: number | null = null;
        nearestBooking = false;
        frameMarkers: Array<{
          index: number;
          title: string;
          x: number;
          y: number;
          promptY: number;
          marker: Phaser.GameObjects.Rectangle;
        }> = [];

        preload() {
          this.load.spritesheet("evanWalk", runtimeAssets.evanWalk, { frameWidth: 256, frameHeight: 256 });
          this.load.spritesheet("evanIdle", runtimeAssets.evanIdle, { frameWidth: 256, frameHeight: 256 });
          this.load.image("interiorTile", runtimeAssets.interiorTile);
          this.load.image("lightOverlay", runtimeAssets.lightOverlay);
          this.load.image("dryCabinet", runtimeAssets.dryCabinet);
          this.load.image("lensCabinet", runtimeAssets.lensCabinet);
          this.load.image("photoWall", runtimeAssets.photoWall);
          this.load.image("photoShootStudio", runtimeAssets.photoShootStudio);
          this.load.image("photographer", runtimeAssets.photographer);

          photoAlbumCategories.forEach((category, index) => {
            if (category.coverSrc) {
              this.load.image(`photoAlbum-${index}`, category.coverSrc);
            }
          });
        }

        create() {
          this.physics.world.setBounds(0, 0, PHOTO_ROOM_WIDTH, PHOTO_ROOM_HEIGHT);
          this.createAlbumPlaceholderTexture();
          this.createRoom();
          this.createAnimations();

          this.blockers = this.physics.add.staticGroup();
          this.createBlockers();

          this.player = this.physics.add.sprite(900, 505, "evanIdle", directionFrames.down.idle);
          this.player.setScale(0.34);
          this.player.setDepth(this.player.y + 1000);
          this.player.setCollideWorldBounds(true);
          this.player.body?.setSize(58, 68, true);
          this.player.body?.setOffset(100, 132);
          this.physics.add.collider(this.player, this.blockers);

          this.cameras.main.setBounds(0, 0, PHOTO_ROOM_WIDTH, PHOTO_ROOM_HEIGHT);
          this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
          this.cameras.main.setZoom(this.roomZoom());
          this.scale.on("resize", () => this.cameras.main.setZoom(this.roomZoom()));
          this.cameras.main.fadeIn(420, 0, 0, 0);
        }

        createAlbumPlaceholderTexture() {
          if (this.textures.exists("photoAlbum-empty")) {
            return;
          }

          const graphics = this.add.graphics().setVisible(false);
          graphics.fillStyle(0x05090f, 1);
          graphics.fillRect(0, 0, 360, 210);
          graphics.lineStyle(2, 0x67e8f9, 0.34);
          graphics.strokeRect(10, 10, 340, 190);
          graphics.fillStyle(0x67e8f9, 0.68);
          [
            [48, 42],
            [92, 82],
            [152, 46],
            [214, 96],
            [286, 58],
            [320, 130],
          ].forEach(([x, y]) => graphics.fillCircle(x, y, 2));
          graphics.lineStyle(3, 0xffd166, 0.18);
          graphics.lineBetween(42, 160, 318, 122);
          graphics.generateTexture("photoAlbum-empty", 360, 210);
          graphics.destroy();
        }

        update() {
          this.updateMovement();
          this.updateNearestFrame();
          if (controlsRef.current.interact) {
            controlsRef.current.interact = false;
            this.tryInteract();
          }
        }

        createRoom() {
          this.add.rectangle(PHOTO_ROOM_WIDTH / 2, PHOTO_ROOM_HEIGHT / 2, PHOTO_ROOM_WIDTH, PHOTO_ROOM_HEIGHT, 0x060708);
          this.add.tileSprite(PHOTO_ROOM_WIDTH / 2, 310, PHOTO_ROOM_WIDTH, 620, "interiorTile")
            .setTint(0x2a2521)
            .setAlpha(0.28)
            .setDepth(0);
          this.add.tileSprite(PHOTO_ROOM_WIDTH / 2, 825, PHOTO_ROOM_WIDTH, 780, "interiorTile")
            .setTint(0x3a2d22)
            .setAlpha(0.72)
            .setDepth(1);

          const structure = this.add.graphics().setDepth(2);
          structure.fillStyle(0x101316, 0.98);
          structure.fillRect(130, 66, 1540, 410);
          structure.lineStyle(4, 0xffd166, 0.24);
          structure.strokeRect(130, 66, 1540, 410);
          structure.fillStyle(0x0b0d0f, 0.88);
          structure.fillTriangle(130, 476, 300, 610, 130, 1130);
          structure.fillTriangle(1670, 476, 1500, 610, 1670, 1130);
          structure.lineStyle(2, 0xffd166, 0.14);
          for (let x = 180; x <= 1620; x += 120) {
            structure.lineBetween(x, 80, x, 1120);
          }
          for (let y = 120; y <= 1120; y += 90) {
            structure.lineBetween(130, y, 1670, y);
          }

          this.add.rectangle(900, 255, 1348, 354, 0x0e1113, 0.92).setDepth(4).setStrokeStyle(4, 0xffd166, 0.18);
          this.add.rectangle(900, 100, 1210, 10, 0x8a7248, 0.5).setDepth(5);

          this.createPhotoWall();
          this.createStudioProps();

          this.add.tileSprite(PHOTO_ROOM_WIDTH / 2, PHOTO_ROOM_HEIGHT / 2, PHOTO_ROOM_WIDTH, PHOTO_ROOM_HEIGHT, "lightOverlay")
            .setAlpha(0.18)
            .setDepth(1800);

          this.promptText = this.add
            .text(this.scale.width / 2, this.scale.height - 64, "", {
              fontFamily: "monospace",
              fontSize: "16px",
              color: "#fff4ce",
              backgroundColor: "rgba(8, 9, 10, 0.82)",
              stroke: "#000000",
              strokeThickness: 5,
              padding: { x: 14, y: 10 },
            })
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(3000)
            .setVisible(false);

        }

        createPhotoWall() {
          const positions = [
            { x: 380, y: 220, width: 238, height: 136, angle: -1.5 },
            { x: 640, y: 302, width: 230, height: 130, angle: 1.2 },
            { x: 900, y: 202, width: 250, height: 142, angle: -0.8 },
            { x: 1160, y: 306, width: 230, height: 130, angle: 1.5 },
            { x: 1420, y: 224, width: 238, height: 136, angle: -1.1 },
          ];

          const rail = this.add.graphics().setDepth(6);
          rail.lineStyle(2, 0xffd166, 0.26);

          positions.forEach(({ x, y, width, height, angle }, index) => {
            const category = photoAlbumCategories[index];
            const coverTexture = category.coverSrc ? `photoAlbum-${index}` : "photoAlbum-empty";
            rail.lineBetween(x - width * 0.32, 106, x - width * 0.22, y - height * 0.55);
            rail.lineBetween(x + width * 0.32, 106, x + width * 0.22, y - height * 0.55);
            rail.fillStyle(0xffd166, 0.55);
            rail.fillCircle(x - width * 0.32, 106, 4);
            rail.fillCircle(x + width * 0.32, 106, 4);

            this.add.rectangle(x + 10, y + 14, width, height, 0x000000, 0.26).setAngle(angle).setDepth(6);
            const frame = this.add.rectangle(x, y, width, height, 0x21170f, 0.98).setAngle(angle).setDepth(8);
            frame.setStrokeStyle(6, index === this.activeIndex ? 0x67e8f9 : 0xb79758, index === this.activeIndex ? 0.88 : 0.68);
            this.add.rectangle(x, y - 12, width - 34, height - 58, 0x050607, 1).setAngle(angle).setDepth(9);
            this.add.image(x, y - 12, coverTexture).setDisplaySize(width - 46, height - 68).setAngle(angle).setDepth(10);
            if (!category.coverSrc) {
              this.add
                .text(x, y - 13, "暂无素材", {
                  fontFamily: "monospace",
                  fontSize: "14px",
                  color: "#67e8f9",
                  stroke: "#000000",
                  strokeThickness: 5,
                })
                .setOrigin(0.5)
                .setAngle(angle)
                .setDepth(11);
            }
            this.add
              .text(x, y + height * 0.36, category.wallLabel, {
                fontFamily: "monospace",
                fontSize: "17px",
                color: "#fff1c4",
                stroke: "#000000",
                strokeThickness: 5,
              })
              .setOrigin(0.5)
              .setAngle(angle)
              .setDepth(10);

            this.add.rectangle(x - width * 0.26, y - height * 0.42, 58, 6, 0xffffff, 0.18).setAngle(angle - 20).setDepth(11);
            this.add.circle(x + width * 0.35, y - height * 0.44, 5, 0xffd166, 0.82).setDepth(11);
            this.add.circle(x, y + height * 0.78, 10, 0x67e8f9, 0.08).setDepth(3);

            const zone = this.add.zone(x, y, width + 12, height + 18).setDepth(12).setInteractive({ useHandCursor: true });
            zone.on("pointerdown", () => this.openAlbumFromFrame(index));

            this.frameMarkers.push({
              index,
              title: category.wallLabel,
              x,
              y,
              promptY: y + height * 0.78,
              marker: frame,
            });
          });
        }

        createStudioProps() {
          this.add
            .image(290, 750, "dryCabinet")
            .setCrop(76, 88, 336, 400)
            .setDisplaySize(210, 250)
            .setDepth(760);
          this.add
            .image(455, 770, "dryCabinet")
            .setCrop(495, 72, 320, 430)
            .setDisplaySize(205, 276)
            .setDepth(770);
          this.add
            .image(310, 1025, "lensCabinet")
            .setCrop(55, 118, 325, 520)
            .setDisplaySize(220, 350)
            .setDepth(1025);
          this.add
            .image(575, 995, "lensCabinet")
            .setCrop(448, 828, 140, 135)
            .setDisplaySize(96, 92)
            .setDepth(995);
          this.add
            .image(690, 990, "lensCabinet")
            .setCrop(595, 832, 160, 130)
            .setDisplaySize(126, 96)
            .setDepth(990);
          this.add
            .image(1430, 706, "photoWall")
            .setCrop(906, 570, 168, 285)
            .setDisplaySize(142, 242)
            .setDepth(706);
          this.add
            .image(1538, 780, "photoWall")
            .setCrop(1288, 596, 95, 200)
            .setDisplaySize(82, 174)
            .setDepth(780);

          this.add.rectangle(700, 845, 540, 326, 0x050607, 0.22).setDepth(604);
          this.add
            .image(700, 845, "photoShootStudio")
            .setDisplaySize(520, 316)
            .setAlpha(0.94)
            .setDepth(608);
          this.bookingMarker = this.add
            .rectangle(700, 845, 526, 322, 0x000000, 0)
            .setDepth(610)
            .setStrokeStyle(4, 0x67e8f9, 0);
          this.add
            .zone(700, 845, 526, 322)
            .setDepth(612)
            .setInteractive({ useHandCursor: true })
            .on("pointerdown", () => this.openBookingPanel());
          this.add.rectangle(700, 1036, 330, 52, 0x090a0b, 0.78).setDepth(1036).setStrokeStyle(2, 0x67e8f9, 0.28);
          this.add
            .text(700, 1027, "预约 SHOT 人像 / 活动", {
              fontFamily: "monospace",
              fontSize: "15px",
              color: "#fff4ce",
              stroke: "#000000",
              strokeThickness: 5,
            })
            .setOrigin(0.5)
            .setDepth(1037);
          this.add
            .text(700, 1048, "点击棚拍场景或靠近按 E", {
              fontFamily: "monospace",
              fontSize: "11px",
              color: "#67e8f9",
              stroke: "#000000",
              strokeThickness: 4,
            })
            .setOrigin(0.5)
            .setDepth(1037);

          this.add.rectangle(1392, 786, 410, 286, 0x0a0b0c, 0.92).setDepth(786).setStrokeStyle(4, 0xb79758, 0.68);
          this.add.rectangle(1392, 644, 150, 6, 0xffd166, 0.62).setDepth(787);
          this.previewImage = this.add.image(1392, 760, "photoAlbum-0").setDisplaySize(320, 182).setDepth(788);
          this.add.rectangle(1392, 760, 342, 204, 0x000000, 0).setDepth(789).setStrokeStyle(8, 0x17110c, 0.95);
          this.selectedTitle = this.add
            .text(1230, 922, photoAlbumCategories[0].wallLabel, {
              fontFamily: "monospace",
              fontSize: "26px",
              color: "#fff4ce",
              stroke: "#000000",
              strokeThickness: 6,
            })
            .setDepth(790);
          this.add
            .text(1230, 892, "SELECTED ALBUM", {
              fontFamily: "monospace",
              fontSize: "15px",
              color: "#67e8f9",
              letterSpacing: 2,
              stroke: "#000000",
              strokeThickness: 5,
            })
            .setDepth(790);

          this.add.rectangle(1255, 1084, 280, 86, 0x090a0b, 0.8).setDepth(1084).setStrokeStyle(3, 0xffd166, 0.26);
          this.add
            .text(1255, 1084, "WASD 移动 · 靠近画框按 E 打开相册", {
              fontFamily: "monospace",
              fontSize: "15px",
              color: "#fff4ce",
              stroke: "#000000",
              strokeThickness: 5,
            })
            .setOrigin(0.5)
            .setDepth(1085);

          [
            [310, 600, 0xffd166, 140, 0.1],
            [900, 360, 0xffd166, 260, 0.12],
            [700, 845, 0xffd166, 160, 0.06],
            [1392, 720, 0xffd166, 190, 0.1],
            [1540, 745, 0x67e8f9, 150, 0.08],
          ].forEach(([x, y, color, radius, alpha]) => this.createLightPool(x, y, color, radius, alpha));
        }

        createLightPool(x: number, y: number, color: number, radius: number, alpha: number) {
          const glow = this.add.graphics().setDepth(3);
          glow.fillStyle(color, alpha);
          glow.fillCircle(x, y, radius);
        }

        createBlockers() {
          [
            [900, 300, 1420, 250],
            [290, 770, 300, 260],
            [310, 1018, 275, 270],
            [700, 845, 540, 330],
            [1392, 795, 430, 300],
            [1430, 720, 170, 230],
            [150, 770, 80, 770],
            [1650, 770, 80, 770],
          ].forEach(([x, y, width, height]) => {
            const block = this.add.rectangle(x, y, width, height, 0x000000, 0);
            this.physics.add.existing(block, true);
            this.blockers.add(block);
          });
        }

        createAnimations() {
          (Object.entries(directionFrames) as Array<[Facing, (typeof directionFrames)[Facing]]>).forEach(
            ([direction, frames]) => {
              this.anims.create({
                key: `photo-walk-${direction}`,
                frames: this.anims.generateFrameNumbers("evanWalk", {
                  start: frames.walkStart,
                  end: frames.walkEnd,
                }),
                frameRate: 8,
                repeat: -1,
              });
            },
          );
        }

        updateMovement() {
          const speed = 195;
          const controls = controlsRef.current;
          let vx = 0;
          let vy = 0;

          if (controls.left) vx -= 1;
          if (controls.right) vx += 1;
          if (controls.up) vy -= 1;
          if (controls.down) vy += 1;

          if (vx !== 0 || vy !== 0) {
            const length = Math.hypot(vx, vy);
            const facing = this.directionFromVector(vx, vy);
            this.facing = facing;
            this.player.setVelocity((vx / length) * speed, (vy / length) * speed);
            this.player.anims.play(`photo-walk-${facing}`, true);
            this.wasMoving = true;
          } else {
            this.stopPlayer();
          }

          this.player.setDepth(this.player.y + 1000);
        }

        updateNearestFrame() {
          let nearestIndex: number | null = null;
          let nearestDistance = Number.POSITIVE_INFINITY;

          this.frameMarkers.forEach((frame) => {
            const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, frame.x, frame.promptY);
            if (distance < 180 && distance < nearestDistance) {
              nearestIndex = frame.index;
              nearestDistance = distance;
            }
          });

          const bookingDistance = Phaser.Math.Distance.Between(this.player.x, this.player.y, 700, 1036);
          this.nearestBooking = bookingDistance < 190 && bookingDistance < nearestDistance;
          this.nearestIndex = this.nearestBooking ? null : nearestIndex;
          this.frameMarkers.forEach((frame) => {
            const isActive = frame.index === this.activeIndex;
            const isNearest = !this.nearestBooking && frame.index === nearestIndex;
            frame.marker.setStrokeStyle(5, isNearest ? 0x67e8f9 : isActive ? 0xffd166 : 0xb79758, isNearest || isActive ? 0.95 : 0.72);
          });
          this.bookingMarker.setStrokeStyle(4, this.nearestBooking ? 0x67e8f9 : 0xffd166, this.nearestBooking ? 0.66 : 0);

          if (this.nearestBooking) {
            this.promptText.setText("E 预约 Shot 人像 / 活动");
            this.promptText.setVisible(true);
            return;
          }

          if (nearestIndex === null) {
            this.promptText.setVisible(false);
            return;
          }

          this.promptText.setText(`E 打开 ${photoAlbumCategories[nearestIndex].wallLabel}相册`);
          this.promptText.setVisible(true);
        }

        tryInteract() {
          if (this.nearestBooking) {
            this.openBookingPanel();
            return;
          }

          if (this.nearestIndex !== null) {
            this.openAlbumFromFrame(this.nearestIndex);
          }
        }

        openBookingPanel() {
          openBooking();
        }

        openAlbumFromFrame(index: number) {
          const category = photoAlbumCategories[index];
          this.activeIndex = index;
          this.previewImage.setTexture(category.coverSrc ? `photoAlbum-${index}` : "photoAlbum-empty");
          this.selectedTitle.setText(category.wallLabel);
          openAlbum(category.id);
        }

        directionFromVector(vx: number, vy: number): Facing {
          if (Math.abs(vx) > Math.abs(vy)) {
            return vx > 0 ? "right" : "left";
          }

          return vy < 0 ? "up" : "down";
        }

        stopPlayer() {
          this.player.setVelocity(0, 0);
          if (this.wasMoving || this.player.anims.isPlaying) {
            this.player.anims.stop();
            this.player.setTexture("evanIdle", directionFrames[this.facing].idle);
            this.wasMoving = false;
          }
        }

        roomZoom() {
          return this.scale.width < 900 ? MOBILE_PHOTO_ROOM_ZOOM : DESKTOP_PHOTO_ROOM_ZOOM;
        }
      }

      game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: parentNode,
        width: parentNode.clientWidth || 1280,
        height: parentNode.clientHeight || 720,
        backgroundColor: "#050505",
        pixelArt: true,
        roundPixels: true,
        scale: {
          mode: Phaser.Scale.RESIZE,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        physics: {
          default: "arcade",
          arcade: {
            debug: false,
          },
        },
        scene: PhotoInteriorScene,
      });
    }

    mountPhotoRoom();

    return () => {
      destroyed = true;
      clearPhotoControls();
      game?.destroy(true);
    };
  }, [clearPhotoControls, openAlbum, openBooking]);

  const pressPhotoControl = useCallback(
    (key: keyof PhotoControlState, event: PointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
      if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.setPointerCapture(event.pointerId);
      }
      setControl(key, true);
    },
    [setControl],
  );

  const releasePhotoControl = useCallback(
    (key: keyof PhotoControlState, event?: PointerEvent<HTMLButtonElement>) => {
      if (event) {
        event.preventDefault();
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }
      }
      setControl(key, false);
    },
    [setControl],
  );

  return (
    <section className="photo-interior photo-game-interior" aria-label="Photo Gif Fake Studio">
      <div ref={roomRef} className="photo-game-stage" />

      <header className="photo-scene-hud">
        <button className="hud-button" onClick={onBack}>
          Back to map
        </button>
        <div className="photo-scene-title">
          <div className="panel-eyebrow">Photo Gif Fake Studio</div>
          <h1>摄影屋场景</h1>
        </div>
      </header>

      <div className="photo-interior-pad" aria-label="Photo room movement controls">
        <button
          className="up"
          onPointerDown={(event) => pressPhotoControl("up", event)}
          onPointerUp={(event) => releasePhotoControl("up", event)}
          onPointerCancel={(event) => releasePhotoControl("up", event)}
          onLostPointerCapture={() => setControl("up", false)}
        >
          W
        </button>
        <button
          className="left"
          onPointerDown={(event) => pressPhotoControl("left", event)}
          onPointerUp={(event) => releasePhotoControl("left", event)}
          onPointerCancel={(event) => releasePhotoControl("left", event)}
          onLostPointerCapture={() => setControl("left", false)}
        >
          A
        </button>
        <button
          className="down"
          onPointerDown={(event) => pressPhotoControl("down", event)}
          onPointerUp={(event) => releasePhotoControl("down", event)}
          onPointerCancel={(event) => releasePhotoControl("down", event)}
          onLostPointerCapture={() => setControl("down", false)}
        >
          S
        </button>
        <button
          className="right"
          onPointerDown={(event) => pressPhotoControl("right", event)}
          onPointerUp={(event) => releasePhotoControl("right", event)}
          onPointerCancel={(event) => releasePhotoControl("right", event)}
          onLostPointerCapture={() => setControl("right", false)}
        >
          D
        </button>
      </div>
      <button className="photo-interior-action" onClick={() => setControl("interact", true)}>
        E
      </button>
      {activeAlbumCategoryId && (
        <PhotoAlbumBook
          activeCategoryId={activeAlbumCategoryId}
          onClose={closeAlbum}
          onOpenPhoto={setActiveLightboxPhoto}
          onSelectCategory={setActiveAlbumCategoryId}
        />
      )}
      {activeLightboxPhoto && <PhotoLightbox photo={activeLightboxPhoto} onClose={closeLightbox} />}
      {bookingOpen && <PhotoBookingPanel onClose={closeBooking} />}
    </section>
  );
}

function PhotoBookingPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="photo-booking-backdrop" role="dialog" aria-modal="true" aria-label="预约 Shot 人像和活动" onClick={onClose}>
      <section className="photo-booking-card" onClick={(event) => event.stopPropagation()}>
        <button className="photo-booking-close" onClick={onClose} aria-label="关闭预约面板">
          X
        </button>
        <div className="photo-booking-kicker">SHOT BOOKING</div>
        <h2>预约 Shot 人像 / 活动</h2>
        <p>棚拍人像、活动跟拍、形象照和短时内容拍摄都从这里预约。</p>
        <div className="photo-booking-options">
          <div>
            <span>01</span>
            <strong>棚拍人像</strong>
            <small>灯光棚拍、形象照、个人写真和内容头像。</small>
          </div>
          <div>
            <span>02</span>
            <strong>活动跟拍</strong>
            <small>现场记录、嘉宾抓拍、快速精选交付。</small>
          </div>
        </div>
        <a className="photo-booking-cta" href="mailto:jiaedwin0605@gmail.com?subject=Shot%20%E4%BA%BA%E5%83%8F%20%2F%20%E6%B4%BB%E5%8A%A8%E9%A2%84%E7%BA%A6">
          发邮件预约
        </a>
      </section>
    </div>
  );
}

function PhotoAlbumBook({
  activeCategoryId,
  onClose,
  onOpenPhoto,
  onSelectCategory,
}: {
  activeCategoryId: PhotoAlbumCategoryId;
  onClose: () => void;
  onOpenPhoto: (photo: PhotoAlbumItem) => void;
  onSelectCategory: (categoryId: PhotoAlbumCategoryId) => void;
}) {
  const activeCategory =
    photoAlbumCategories.find((category) => category.id === activeCategoryId) ?? photoAlbumCategories[0];

  return (
    <div className="album-backdrop" role="dialog" aria-modal="true" aria-label={`${activeCategory.wallLabel}相册`}>
      <section className="album-book">
        <button className="album-close" onClick={onClose} aria-label="关闭相册">
          X
        </button>

        <nav className="album-tabs" aria-label="摄影分类">
          {photoAlbumCategories.map((category) => (
            <button
              key={category.id}
              className={category.id === activeCategory.id ? "active" : ""}
              onClick={() => onSelectCategory(category.id)}
              aria-pressed={category.id === activeCategory.id}
            >
              {category.tabLabel}
            </button>
          ))}
        </nav>

        <div className="album-spread">
          <aside className="album-cover-page">
            <div className="album-kicker">PHOTO BOOK</div>
            <h2>{activeCategory.wallLabel}</h2>
            <p>{activeCategory.description}</p>
            {activeCategory.items.length > 0 ? (
              <div className="album-contact-strip">
                {activeCategory.items.slice(0, 3).map((item) => (
                  <button key={item.title} onClick={() => onOpenPhoto(item)} aria-label={`放大查看 ${item.title}`}>
                    <Image src={item.src} alt={item.caption} width={112} height={76} />
                  </button>
                ))}
              </div>
            ) : (
              <div className="album-empty-note">素材库里暂时没有这个分类的照片。</div>
            )}
          </aside>

          <div className="album-photo-page">
            <div className="album-page-title">
              <span>{activeCategory.tabLabel}</span>
              <strong>{activeCategory.items.length} prints</strong>
            </div>
            {activeCategory.items.length > 0 ? (
              <div className="album-pinned-grid">
                {activeCategory.items.map((item) => (
                  <button
                    className="album-print-button"
                    key={item.title}
                    onClick={() => onOpenPhoto(item)}
                    aria-label={`放大查看 ${item.title}`}
                  >
                    <figure className="album-print" style={{ transform: `rotate(${item.rotate})` }}>
                      <span className="album-pin" aria-hidden="true" />
                      <Image src={item.src} alt={item.caption} width={260} height={170} />
                      <figcaption>
                        <strong>{item.title}</strong>
                        <span>{item.caption}</span>
                        <small>{item.meta}</small>
                      </figcaption>
                    </figure>
                  </button>
                ))}
              </div>
            ) : (
              <div className="album-empty-state">
                <strong>暂无星空作品</strong>
                <span>这个分类不会再混入树、建筑、海岸或人像照片。</span>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function PhotoLightbox({ photo, onClose }: { photo: PhotoAlbumItem; onClose: () => void }) {
  return (
    <div className="photo-lightbox-backdrop" role="dialog" aria-modal="true" aria-label={`${photo.title} 原片查看`} onClick={onClose}>
      <section className="photo-lightbox" onClick={(event) => event.stopPropagation()}>
        <button className="photo-lightbox-close" onClick={onClose} aria-label="关闭原片">
          X
        </button>
        <div className="photo-lightbox-image">
          <Image src={photo.fullSrc} alt={photo.caption} width={2400} height={1600} priority />
        </div>
        <div className="photo-lightbox-caption">
          <div>
            <strong>{photo.title}</strong>
            <span>{photo.caption}</span>
          </div>
          <small>{photo.meta}</small>
        </div>
      </section>
    </div>
  );
}

function PanelOverlay({
  panel,
  title,
  onClose,
}: {
  panel: Exclude<PanelId, null>;
  title: string;
  onClose: () => void;
}) {
  return (
    <div className="panel-backdrop" role="dialog" aria-modal="true" aria-label={title}>
      <section className="panel">
        <div className="panel-header">
          <div>
            <div className="panel-eyebrow">Interactive Node</div>
            <h2>{title}</h2>
          </div>
          <button className="panel-close" onClick={onClose} aria-label="Close panel">
            X
          </button>
        </div>

        {panel === "studio" && <StudioPanel />}
        {panel === "photo" && <PhotoPanel />}
        {panel === "game" && <GamePanel />}
        {panel === "broadcast" && <BroadcastPanel />}
      </section>
    </div>
  );
}

function StudioPanel() {
  return (
    <div className="panel-grid">
      {projectCards.map((project) => (
        <article className="pixel-card" key={project.title}>
          <div className="card-accent" style={{ background: project.accent }} />
          <h3>{project.title}</h3>
          <p>{project.type}</p>
          <p>{project.detail}</p>
        </article>
      ))}
    </div>
  );
}

function PhotoPanel() {
  return (
    <div className="panel-grid">
      {photoCards.map((photo) => (
        <article className="pixel-card" key={photo.title}>
          <div className="card-accent" style={{ background: "#ffd166" }} />
          <h3>{photo.title}</h3>
          <p>{photo.detail}</p>
        </article>
      ))}
    </div>
  );
}

function BroadcastPanel() {
  return (
    <div className="panel-grid">
      {broadcastItems.map((item) => (
        <article className="pixel-card" key={item}>
          <div className="card-accent" style={{ background: "#67e8f9" }} />
          <h3>Powered by OpenClaw</h3>
          <p>{item}</p>
        </article>
      ))}
    </div>
  );
}

function GamePanel() {
  const [score, setScore] = useState(0);
  return (
    <div className="mini-game">
      <div className="score-box">
        <span>{score}</span>
      </div>
      <div className="pixel-card">
        <h3>Signal Tap</h3>
        {gameNotes.map((note) => (
          <p key={note}>{note}</p>
        ))}
        <button className="hud-button" onClick={() => setScore((value) => value + 1)}>
          Tap Signal
        </button>
      </div>
    </div>
  );
}
