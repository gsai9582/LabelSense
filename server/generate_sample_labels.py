import os
import fitz  # PyMuPDF

DOCS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "docs", "sample_labels"))
os.makedirs(DOCS_DIR, exist_ok=True)

def create_clinical_label_pdf(filepath: str, title: str, sku: str, gtin: str, lot: str, exp: str, device_class: str, is_critical: bool = False, is_review: bool = False):
    doc = fitz.open()
    # 400 x 260 pt label
    page = doc.new_page(width=400, height=260)
    
    # Border & background
    border_rect = fitz.Rect(10, 10, 390, 250)
    page.draw_rect(border_rect, color=(0.15, 0.2, 0.25), fill=(0.99, 0.99, 0.99), width=1.5)
    
    # Header Banner
    header_rect = fitz.Rect(10, 10, 390, 42)
    header_fill = (0.05, 0.58, 0.53) if not is_critical else (0.88, 0.22, 0.22)
    page.draw_rect(header_rect, color=header_fill, fill=header_fill)
    page.insert_text(fitz.Point(20, 32), "LabelSense Medical Device Label Sample", fontsize=11, color=(1, 1, 1))
    badge_text = "CLASS III IMPLANTABLE" if "III" in device_class else "CLASS II MEDICAL DEVICE"
    page.insert_text(fitz.Point(260, 32), badge_text, fontsize=8, color=(1, 1, 1))
    
    # Product Title & Descriptor
    page.insert_text(fitz.Point(20, 64), title, fontsize=13, color=(0.1, 0.12, 0.15))
    page.insert_text(fitz.Point(20, 78), f"REF / Catalog No: {sku}   |   Sterile Barrier Envelope", fontsize=9, color=(0.4, 0.45, 0.5))
    
    # Divider line
    page.draw_line(fitz.Point(20, 88), fitz.Point(380, 88), color=(0.85, 0.88, 0.9), width=0.8)
    
    # Left Column: Regulatory & Batch Metadata
    page.insert_text(fitz.Point(20, 106), "MANUFACTURER:", fontsize=8, color=(0.4, 0.45, 0.5))
    page.insert_text(fitz.Point(20, 119), "VascuLife Technologies Inc.", fontsize=9, color=(0.1, 0.12, 0.15))
    page.insert_text(fitz.Point(20, 131), "100 Medical Pkw, Irvine, CA 92618 USA", fontsize=8, color=(0.3, 0.35, 0.4))
    
    page.insert_text(fitz.Point(20, 152), f"LOT NUMBER: {lot}", fontsize=9, color=(0.1, 0.12, 0.15))
    page.insert_text(fitz.Point(20, 168), f"USE BY / EXPIRY: {exp}", fontsize=9, color=(0.1, 0.12, 0.15))
    page.insert_text(fitz.Point(20, 184), "STERILIZATION: STERILE EO", fontsize=8, color=(0.2, 0.25, 0.3))
    page.insert_text(fitz.Point(20, 198), "STORAGE: Store between 15°C and 25°C. Keep Dry.", fontsize=7.5, color=(0.35, 0.4, 0.45))
    
    # Right Column: ISO 15223-1 Symbols & CE
    page.draw_rect(fitz.Rect(250, 98, 380, 175), color=(0.88, 0.9, 0.92), fill=(0.96, 0.97, 0.98), width=0.5)
    page.insert_text(fitz.Point(260, 114), "ISO 15223-1 SYMBOLS:", fontsize=7.5, color=(0.4, 0.45, 0.5))
    page.insert_text(fitz.Point(260, 130), "[STERILE|EO]  [LOT]  [REF]", fontsize=8.5, color=(0.1, 0.15, 0.2))
    page.insert_text(fitz.Point(260, 146), "[USE-BY]  [DO NOT REUSE]", fontsize=8.5, color=(0.1, 0.15, 0.2))
    page.insert_text(fitz.Point(260, 164), "CE 0123  MD  Rx Only", fontsize=8.5, color=(0.05, 0.5, 0.45))
    
    # Bottom: GS1 Human Readable Interpretation (HRI)
    hri_box = fitz.Rect(20, 210, 380, 240)
    box_color = (0.94, 0.95, 0.97) if not is_critical else (1.0, 0.95, 0.95)
    page.draw_rect(hri_box, color=(0.8, 0.82, 0.85), fill=box_color, width=0.5)
    
    exp_yymmdd = exp.replace("-", "")[2:] if len(exp) == 10 else "271231"
    udi_hri = f"(01){gtin}(17){exp_yymmdd}(10){lot}(21)SN-99824"
    
    page.insert_text(fitz.Point(28, 224), "GS1 DataMatrix UDI Human Readable Interpretation (HRI):", fontsize=7, color=(0.4, 0.45, 0.5))
    page.insert_text(fitz.Point(28, 235), udi_hri, fontsize=8.5, color=(0.05, 0.1, 0.2))
    
    doc.save(filepath)
    # Also save a raster PNG version for image upload / OCR testing
    png_path = filepath.replace(".pdf", ".png")
    pix = page.get_pixmap(dpi=150)
    pix.save(png_path)
    doc.close()
    print(f"Generated: {filepath} and {png_path}")

def main():
    # 1. Scenario A: PASS
    create_clinical_label_pdf(
        filepath=os.path.join(DOCS_DIR, "Scenario_A_PASS_CardioFlow_Stent.pdf"),
        title="CardioFlow Drug-Eluting Coronary Stent System",
        sku="CFS-3018",
        gtin="00840123456786",
        lot="LOT-2024-089A",
        exp="2027-12-31",
        device_class="Class III"
    )
    
    # 2. Scenario B: CRITICAL (Bad GTIN Check Digit)
    create_clinical_label_pdf(
        filepath=os.path.join(DOCS_DIR, "Scenario_B_CRITICAL_NeuroCath_BadGTIN.pdf"),
        title="NeuroCath Microcatheter Infusion Guide",
        sku="NC-014-150",
        gtin="00840123456789",
        lot="LOT-2024-X91",
        exp="2026-06-30",
        device_class="Class II",
        is_critical=True
    )
    
    # 3. Scenario C: REVIEW (Expiry Drift / Near Expiry)
    create_clinical_label_pdf(
        filepath=os.path.join(DOCS_DIR, "Scenario_C_REVIEW_OrthoSuture_ExpiryDrift.pdf"),
        title="OrthoSuture Braided Polyglactin Antibacterial Suture",
        sku="OS-20-T",
        gtin="00840123456786",
        lot="LOT-2024-090B",
        exp="2024-05-31",
        device_class="Class II",
        is_review=True
    )
    print("All 3 clinical sample labels created successfully in docs/sample_labels/")

if __name__ == "__main__":
    main()
