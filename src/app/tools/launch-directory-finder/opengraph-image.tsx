import { ImageResponse } from "next/og";

export const alt = "Launch Directory Finder — SaaS and startup launch directories";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          background: "#ffffff",
          color: "#111827",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, fontWeight: 700, color: "#222288" }}>EarlyHunt</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 68, fontWeight: 700, letterSpacing: -1.5, lineHeight: 1.05 }}>
            Launch Directory Finder
          </div>
          <div style={{ marginTop: 24, fontSize: 30, color: "#4b5563", maxWidth: 900 }}>
            Filter startup and SaaS launch directories by price, dofollow, and approximate Domain Rating.
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#222288" }}>earlyhunt.com/tools/launch-directory-finder</div>
      </div>
    ),
    { ...size },
  );
}
