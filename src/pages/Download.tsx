import React, { useEffect, useState, useRef } from "react";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const DownloadTemplate: React.FC = () => {
  const [appId, setAppId] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = "ND-" + Date.now().toString().slice(-6);
    setAppId(id);
    setCreatedAt(new Date().toLocaleString());
  }, []);

  const handleDownloadPDF = async () => {
    if (!sheetRef.current) return;

    const canvas = await html2canvas(sheetRef.current, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgProps = { width: canvas.width, height: canvas.height };
    const pdfHeight = (imgProps.height * pageWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pdfHeight);
    pdf.save(`caregiver-application-${appId}.pdf`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 text-slate-800">
      {/* Download button */}
      <div className="flex justify-end w-full max-w-5xl mb-4">
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition"
        >
          <Download className="h-4 w-4" /> Download PDF
        </button>
      </div>

      {/* Form container with gradient background */}
      <div
        ref={sheetRef}
        id="sheet"
        className="border border-blue-100 rounded-xl p-4 w-full max-w-5xl shadow-sm text-[11px] space-y-3 bg-gradient-to-br from-blue-200 via-white to-yellow-200"
        style={{ width: "210mm", minHeight: "297mm" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-16 h-16 rounded-lg overflow-hidden">
            <img
              src="https://rising-sun.org/wp-content/uploads/2025/07/fotrs-logo-transparent.webp"
              alt="New Daybreak"
              className="object-contain w-full h-full"
            />
          </div>
          <div>
            <h1 className="text-blue-600 font-semibold text-base">
              New Daybreak — Caregiver Application
            </h1>
            <p className="text-xs text-slate-500">
              Complete this form and download or submit to the hiring team.
            </p>
          </div>
          <div className="ml-auto text-right text-[10px] text-slate-500">
            <div>Application ID: {appId || "—"}</div>
            <div>Created: {createdAt || "—"}</div>
          </div>
        </div>

        <form className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-2 text-[11px]">
          {/* Left Section */}
          <div className="space-y-2">
            {[
              "Full Name",
              "Phone",
              "Email",
              "Address",
              "City / State / ZIP",
              "Position Desired",
            ].map((label) => (
              <div key={label} className="flex flex-col">
                <label className="font-semibold mb-1">{label}</label>
                <input
                  type="text"
                  className="border border-blue-100 rounded p-1 text-[10px] h-7"
                />
              </div>
            ))}

            {["Education Level", "Certifications (comma-separated)"].map((label) => (
              <div key={label} className="flex flex-col">
                <label className="font-semibold mb-1">{label}</label>
                <input
                  type="text"
                  className="border border-blue-100 rounded p-1 text-[10px] h-7"
                />
              </div>
            ))}

            {["Employment History", "Skills & Experience"].map((label) => (
              <div key={label} className="flex flex-col">
                <label className="font-semibold mb-1">{label}</label>
                <textarea
                  className="border border-blue-100 rounded p-1 text-[10px] min-h-[50px]"
                />
              </div>
            ))}

            <div className="flex flex-col">
              <label className="font-semibold mb-1">Qualifications & Capabilities</label>
              <div className="grid grid-cols-2 gap-1 text-[10px]">
                {[
                  "Over 18",
                  "Driver's License",
                  "Reliable Transport",
                  "Physical Tasks",
                  "Physical Assistance",
                  "Hygiene Assistance",
                ].map((cap) => (
                  <label key={cap}>
                    <input type="checkbox" className="mr-1" /> {cap}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <label className="font-semibold mb-1">Availability</label>
              <input
                type="text"
                className="border border-blue-100 rounded p-1 text-[10px] h-7"
              />
            </div>
          </div>

          {/* Right Section */}
          <aside className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="flex flex-col">
                <label className="font-semibold mb-1">Reference {i} — Name</label>
                <input type="text" className="border border-blue-100 rounded p-1 text-[10px] h-7" />
                <label className="font-semibold mb-1 mt-1">Phone</label>
                <input type="text" className="border border-blue-100 rounded p-1 text-[10px] h-7" />
                <label className="font-semibold mb-1 mt-1">Relationship</label>
                <input type="text" className="border border-blue-100 rounded p-1 text-[10px] h-7" />
              </div>
            ))}

            <div className="flex flex-col">
              <label className="font-semibold mb-1">Emergency Contact — Name</label>
              <input type="text" className="border border-blue-100 rounded p-1 text-[10px] h-7" />
              <label className="font-semibold mb-1 mt-1">Phone</label>
              <input type="text" className="border border-blue-100 rounded p-1 text-[10px] h-7" />
              <label className="font-semibold mb-1 mt-1">Relationship</label>
              <input type="text" className="border border-blue-100 rounded p-1 text-[10px] h-7" />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold mb-1">Internal Notes (optional)</label>
              <textarea
                className="border border-blue-100 rounded p-1 text-[10px] min-h-[50px]"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold mb-1">Signature (type full name)</label>
              <input type="text" className="border border-blue-100 rounded p-1 text-[10px] h-7" />
              <p className="text-[8px] text-slate-500 mt-1">
                Type full name to act as electronic signature.
              </p>
            </div>
          </aside>
        </form>

        <div className="text-[8px] text-slate-400 mt-2">
          New Daycare Home Support — Application Form
        </div>
      </div>
    </div>
  );
};

export default DownloadTemplate;
