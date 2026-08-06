from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import KeepTogether, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


OUTPUT = "output/pdf/Evan-Lin-Photography-Resume.pdf"


def build_resume() -> None:
    pdfmetrics.registerFont(TTFont("Arial", "/System/Library/Fonts/Supplemental/Arial.ttf"))
    pdfmetrics.registerFont(TTFont("Arial-Bold", "/System/Library/Fonts/Supplemental/Arial Bold.ttf"))
    doc = SimpleDocTemplate(
        OUTPUT,
        pagesize=A4,
        rightMargin=19 * mm,
        leftMargin=19 * mm,
        topMargin=16 * mm,
        bottomMargin=15 * mm,
        title="Evan Lin - Photography Assistant and Sports Photographer Resume",
        author="Evan Lin",
    )

    styles = getSampleStyleSheet()
    name = ParagraphStyle(
        "Name", parent=styles["Normal"], fontName="Arial-Bold", fontSize=24,
        leading=28, textColor=colors.HexColor("#181818"), spaceAfter=3,
    )
    role = ParagraphStyle(
        "Role", parent=styles["Normal"], fontName="Arial-Bold", fontSize=11.5,
        leading=14, textColor=colors.HexColor("#202020"), spaceAfter=7,
    )
    contact = ParagraphStyle(
        "Contact", parent=styles["Normal"], fontName="Arial", fontSize=8.5,
        leading=11, textColor=colors.HexColor("#333333"), spaceAfter=8,
    )
    section = ParagraphStyle(
        "Section", parent=styles["Normal"], fontName="Arial-Bold", fontSize=10.5,
        leading=13, textColor=colors.HexColor("#202020"), spaceBefore=7, spaceAfter=5,
    )
    body = ParagraphStyle(
        "Body", parent=styles["Normal"], fontName="Arial", fontSize=9,
        leading=12, textColor=colors.HexColor("#202020"), spaceAfter=3,
    )
    small = ParagraphStyle(
        "Small", parent=body, fontSize=8.5, leading=11,
    )
    bullet = ParagraphStyle(
        "Bullet", parent=body, leftIndent=10, firstLineIndent=-7, bulletIndent=0,
        spaceAfter=2,
    )
    job = ParagraphStyle(
        "Job", parent=body, fontName="Arial-Bold", spaceAfter=1,
    )
    muted = ParagraphStyle(
        "Muted", parent=body, textColor=colors.HexColor("#666666"), alignment=TA_LEFT,
    )

    story = [
        Paragraph("Evan Lin (Dailin Jia)", name),
        Paragraph("Photography Assistant / Sports Photographer / Second Shooter", role),
        Paragraph(
            "Preferred name: Evan | Kensington, Sydney NSW 2033 | 0412 522 985 | "
            "jiaedwin0605@gmail.com | Portfolio: evanlin.site/photography | UNSW Student",
            contact,
        ),
    ]

    def section_title(title: str) -> None:
        story.append(Paragraph(title, section))
        story.append(Table([['']], colWidths=[177 * mm], rowHeights=[0.6 * mm],
                           style=TableStyle([('LINEABOVE', (0, 0), (-1, -1), 0.7, colors.HexColor('#222222'))])))
        story.append(Spacer(1, 2))

    section_title("PROFILE")
    story.append(Paragraph(
        "Sydney-based photographer with three years of hands-on experience, focused on portrait and "
        "street photography with a strong eye for composition, light and visual style. Comfortable "
        "working with people, adapting to location and changing conditions, and taking a shoot from "
        "capture through selection and delivery. Seeking casual, assistant, second-shooter or junior "
        "photographer opportunities with Sydney photographers, studios, clubs and creative teams.", body
    ))

    section_title("KEY SKILLS")
    skills = [
        "Portrait and street photography",
        "Sports and action photography",
        "Composition, light and visual storytelling",
        "Adobe Lightroom and Photoshop",
        "Camera and lens product knowledge",
        "Calm communication and subject direction",
        "Reliable file handling and attention to detail",
        "Comfortable bringing personal equipment on location",
    ]
    skill_cells = [
        [Paragraph(skills[i], body), Paragraph(skills[i + 1], body)]
        for i in range(0, len(skills), 2)
    ]
    story.append(Table(skill_cells, colWidths=[88.5 * mm, 88.5 * mm], style=TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 1),
    ])))

    section_title("RELEVANT EXPERIENCE")
    story.append(KeepTogether([
        Table([[Paragraph("Independent Photographer, Sydney", job), Paragraph("Three years", muted)]],
              colWidths=[122 * mm, 55 * mm], style=TableStyle([
                  ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                  ('LEFTPADDING', (0, 0), (-1, -1), 0),
                  ('RIGHTPADDING', (0, 0), (-1, -1), 0),
                  ('TOPPADDING', (0, 0), (-1, -1), 0),
                  ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
              ])),
        Paragraph("• Built a personal portfolio primarily around portraits and street photography, with an emphasis on mood, composition and authentic moments.", bullet),
        Paragraph("• Plan and execute shoots independently, including location decisions, camera setup, subject interaction, image selection and post-production.", bullet),
        Paragraph("• Use Lightroom and Photoshop for culling, colour, tonal adjustment, retouching and final delivery.", bullet),
        Paragraph("• Developing a sports photography focus and available for training, club games, events and content assignments, including evenings and weekends.", bullet),
    ]))
    story.append(Spacer(1, 4))
    story.append(KeepTogether([
        Table([[Paragraph("Technology Projects and Operations Experience", job), Paragraph("Technical background", muted)]],
              colWidths=[122 * mm, 55 * mm], style=TableStyle([
                  ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                  ('LEFTPADDING', (0, 0), (-1, -1), 0),
                  ('RIGHTPADDING', (0, 0), (-1, -1), 0),
                  ('TOPPADDING', (0, 0), (-1, -1), 0),
                  ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
              ])),
        Paragraph("• Strong process-following, documentation and problem-solving habits from team-based software and operations work.", bullet),
        Paragraph("• Fast learner who can work independently, communicate clearly and take ownership of practical tasks on a busy set or event day.", bullet),
        Paragraph("• Comfortable learning a studio's workflow, naming conventions, backup process, safety requirements and client standards.", bullet),
    ]))

    section_title("EQUIPMENT")
    story.append(Paragraph(
        "Personal kit available for location work: Canon 300mm f/2.8; Sigma 135mm f/1.8 Art; "
        "Samyang 35-150mm f/2-2.8; Sigma 100-400mm f/5-6.3 DG DN; Fujifilm GFX 100; "
        "Panasonic Lumix S9 and S5II; plus additional Canon, Sigma, Tamron, Panasonic, "
        "TTArtisan, Takumar and Laowa lenses. Full gear list: evanlin.site/photography#gear.", small
    ))

    section_title("EDUCATION")
    story.append(Paragraph("University of New South Wales (UNSW) - Student, Sydney NSW", body))

    section_title("WORK RIGHTS AND AVAILABILITY")
    story.append(Paragraph(
        "Holds a valid Student visa (subclass 500) with work rights in Australia. Available for casual "
        "and project-based work, including Saturday and Sunday assignments; flexible around university commitments.", body
    ))

    doc.build(story)


if __name__ == "__main__":
    build_resume()
