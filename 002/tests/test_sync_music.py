import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "pipeline"))
from sync_music import build, chunks, pick_tracks, playable, to_track  # noqa: E402


def song(sid, name="Song", fee=8, **extra):
    return {"id": sid, "name": name, "fee": fee, "dt": 187654, "ar": [{"name": "A"}, {"name": "B"}],
            "al": {"name": "Album", "picUrl": "http://p1.music.126.net/x/y.jpg"}, **extra}


class Playable(unittest.TestCase):
    def test_free_songs_only(self):
        self.assertTrue(playable(song(1, fee=0)))
        self.assertTrue(playable(song(1, fee=8)))
        self.assertFalse(playable(song(1, fee=1)))       # 会员曲目
        self.assertFalse(playable(song(1, fee=4)))       # 付费专辑
        self.assertFalse(playable({"id": 1, "name": "no fee"}))

    def test_no_copyright_is_dropped(self):
        self.assertFalse(playable(song(1, fee=0, noCopyrightRcmd={"type": 3, "typeDesc": "MV可播"})))
        self.assertTrue(playable(song(1, fee=0, noCopyrightRcmd=None)))


class ToTrack(unittest.TestCase):
    def test_fields_are_normalised(self):
        self.assertEqual(to_track(song(7, name="  雨爱 ")), {
            "id": 7, "title": "雨爱", "artist": "A / B", "album": "Album",
            "cover": "https://p1.music.126.net/x/y.jpg", "duration": 188,
        })

    def test_missing_fields_do_not_crash(self):
        self.assertEqual(to_track({"id": 9, "name": "Bare"}), {"id": 9, "title": "Bare", "artist": "", "album": "", "cover": "", "duration": 0})
        self.assertEqual(to_track({"id": 9, "name": "X", "ar": [{"name": ""}, {}], "al": {"picUrl": "javascript:alert(1)"}})["cover"], "")


class PickTracks(unittest.TestCase):
    def test_keeps_playlist_order_and_filters(self):
        songs = [song(3, "c"), song(1, "a"), song(2, "vip", fee=1), song(4, ""), song(5, "e", fee=0)]
        out = pick_tracks([1, 2, 3, 4, 5, 6], songs)
        self.assertEqual([t["id"] for t in out], [1, 3, 5])        # 2 是会员曲、4 没有标题、6 没查到详情

    def test_limit_and_duplicates(self):
        songs = [song(i, f"s{i}") for i in range(1, 8)]
        self.assertEqual([t["id"] for t in pick_tracks([1, 1, 2, 3, 2, 4], songs, limit=3)], [1, 2, 3])
        self.assertEqual(pick_tracks([], songs), [])

    def test_inputs_are_not_mutated(self):
        order, songs = [2, 1], [song(1), song(2)]
        pick_tracks(order, songs)
        self.assertEqual(order, [2, 1])
        self.assertEqual([s["id"] for s in songs], [1, 2])


class Build(unittest.TestCase):
    def test_document_shape(self):
        playlist = {"id": 2722035655, "name": "喜欢的音乐", "trackCount": 461, "trackIds": [{"id": 1}, {"id": 2}]}
        doc = build(playlist, [song(1, "a"), song(2, "vip", fee=1)], "2026-10-08T00:00:00+00:00")
        self.assertEqual(doc["updated"], "2026-10-08T00:00:00+00:00")
        self.assertEqual(doc["playlist"], {"id": "2722035655", "name": "喜欢的音乐", "url": "https://music.163.com/#/playlist?id=2722035655", "total": 461})
        self.assertEqual([t["id"] for t in doc["tracks"]], [1])

    def test_total_falls_back_to_track_ids(self):
        doc = build({"id": 5, "name": "x", "trackIds": [{"id": 1}, {"id": 2}, {"id": 3}]}, [], "now")
        self.assertEqual(doc["playlist"]["total"], 3)
        self.assertEqual(doc["tracks"], [])


class Chunks(unittest.TestCase):
    def test_chunks(self):
        self.assertEqual(list(chunks([1, 2, 3, 4, 5], 2)), [[1, 2], [3, 4], [5]])
        self.assertEqual(list(chunks([], 2)), [])


if __name__ == "__main__":
    unittest.main()
