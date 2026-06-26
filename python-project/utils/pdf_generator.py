# python-project/utils/pdf_generator.py
import os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def generate_assessment_pdf(filename, username, domain, score, total_questions, percentage, skill_level):
    """
    Generates a highly-polished academic performance PDF certificate report using ReportLab.
    """
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    
    # Initialize Document Flow Parameters
    doc = SimpleDocTemplate(filename, pagesize=letter,
                            rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40)
    story = []
    
    # Text Styles setup
    styles = getSampleStyleSheet()
    
    # Custom display typography
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        textColor=colors.HexColor('#1e1b4b'), # Deep indigo
        spaceAfter=15
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        textColor=colors.HexColor('#475569'), # Slate
        spaceAfter=25
    )
    
    heading_style = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        textColor=colors.HexColor('#312e81'),
        spaceAfter=10,
        spaceBefore=15
    )
    
    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['BodyText'],
        fontName='Helvetica',
        fontSize=10,
        textColor=colors.HexColor('#1e293b'),
        spaceAfter=8
    )

    # Document Header Title Block
    story.append(Paragraph("TECHNICAL COMPETENCY CERTIFICATE", title_style))
    story.append(Paragraph(f"Autonomous Skill Assessment & Course Recommendations Evaluation Report", subtitle_style))
    story.append(Spacer(1, 10))

    # Student Metadata Table Overview
    meta_data = [
        [Paragraph("<b>Candidate Name:</b>", body_style), Paragraph(username, body_style)],
        [Paragraph("<b>Specialization Track:</b>", body_style), Paragraph(domain, body_style)],
        [Paragraph("<b>Correct Responses:</b>", body_style), Paragraph(f"{score} / {total_questions} Answers", body_style)],
        [Paragraph("<b>Accuracy Rating:</b>", body_style), Paragraph(f"{percentage:.1f}%", body_style)],
        [Paragraph("<b>Calculated Proficiency:</b>", body_style), Paragraph(f"<b>{skill_level}</b>", body_style)],
    ]
    
    meta_table = Table(meta_data, colWidths=[150, 350])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f8fafc')),
        ('PADDING', (0, 0), (-1, -1), 10),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ]))
    
    story.append(meta_table)
    story.append(Spacer(1, 20))

    # Skill Gap Summary sections
    story.append(Paragraph("AI-BASED GAP DIAGNOSIS", heading_style))
    
    if skill_level == "Beginner":
        diag_text = ("The student possesses basic curiosity in programming but lacks syntax depth. "
                     "Identified weak areas are: complex conditional functions, dynamic indexing algorithms, and standard architectural libraries. "
                     "Action steps: clear base-level operators, build 3 sandbox projects, and study procedurals rules.")
    elif skill_level == "Intermediate":
        diag_text = ("The student demonstrates a strong fundamental procedural posture. "
                     "Identified weak areas are: memory efficiency optimizations, complex pointer references, and REST server API security CORS rules. "
                     "Action steps: practice big O structures profiling, study advanced decorator decorators, and master database indexing configurations.")
    else:
        diag_text = ("The student exhibits highly advanced analytical and full-procedural competency. "
                     "Continuous growth areas are: global cloud network load-balancing, microservices, and neural networks derivatives algorithms. "
                     "Action steps: contribute to heavy open-source, deconstruct high-concurrency loops, and practice deep neural weights backpropagation.")

    story.append(Paragraph(diag_text, body_style))
    story.append(Spacer(1, 15))

    # Suggested step-by-step learning path overview list
    story.append(Paragraph("RECOMMENDED ACADEMIC ROADMAP", heading_style))
    path_data = [
        ["Phase", "Actionable Curricula Study Domain"],
        ["Phase 1", f"Syllabus core essentials & procedural variables for {domain}"],
        ["Phase 2", "Data Collections, Hash Maps, references and error blocks"],
        ["Phase 3", "Database Normalizations & query optimization indexing schemas"],
        ["Phase 4", "REST backends, API route mapping middlewares & CORS policies"],
        ["Phase 5", "Production Deployment pipelines, Docker and Generative AI SDKs"]
    ]
    path_table = Table(path_data, colWidths=[100, 400])
    path_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#e0e7ff')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#1e1b4b')),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('PADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
    ]))
    story.append(path_table)
    story.append(Spacer(1, 25))

    story.append(Paragraph("Report issued autonomously by AI Skill Assessment Engine in 2026. Certified Copy.", subtitle_style))

    # Build the document
    doc.build(story)
    print(f"PDF compiled and written successfully to: {filename}")
    return filename
# testing mock call
if __name__ == '__main__':
    generate_assessment_pdf('test_report.pdf', 'Candidate student', 'Python', 8, 10, 80.0, 'Advanced')
