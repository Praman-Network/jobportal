import { ImageResponse } from 'next/og';
import { createClient } from "@/lib/supabase-server";
import { getExternalJobs } from "@/lib/external-jobs";

// Route segment config
export const runtime = 'edge';

// Image metadata
export const alt = 'Praman Jobs — Internship & Job Board';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  // Fetch job details
  let title = "Tech Role";
  let company = "Top Company";
  let location = "India";
  let isInternship = false;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", id)
      .single();

    if (data) {
      title = data.title;
      company = data.company;
      location = data.location || "India";
      isInternship = title.toLowerCase().includes("intern");
    } else {
      // Check external jobs
      const externalJobs = await getExternalJobs();
      const extJob = externalJobs.find(j => j.id === id);
      if (extJob) {
        title = extJob.title;
        company = extJob.company;
        location = extJob.location;
        isInternship = extJob.jobType === "Internship" || title.toLowerCase().includes("intern");
      } else {
        // Fallback parsing for expired external jobs
        const isArbeitnow = id.startsWith('arbeitnow-');
        let fallbackTitle = isArbeitnow ? id.replace('arbeitnow-', '').split('-').slice(0, 4).join(' ') : 'Tech Role';
        title = fallbackTitle.charAt(0).toUpperCase() + fallbackTitle.slice(1);
        company = id.includes('gh-') ? id.split('-')[1] : (id.includes('lever-') ? id.split('-')[1] : 'Company');
        // Capitalize company
        company = company.charAt(0).toUpperCase() + company.slice(1);
      }
    }
  } catch (err) {
    console.error(err);
  }

  // Generate dynamic image
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#07080a',
          backgroundImage: 'radial-gradient(circle at 100% 0%, rgba(0, 240, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 0% 100%, rgba(120, 50, 255, 0.1) 0%, transparent 50%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
          padding: '60px 80px',
        }}
      >
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 240, 255, 0.1)', border: '1px solid rgba(0, 240, 255, 0.3)', color: '#00F0FF', fontSize: '24px', fontWeight: 'bold' }}>
            P
          </div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '2px', color: '#fff' }}>PRAMAN JOBS</div>
        </div>

        {/* Job Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '32px', color: '#00F0FF', fontWeight: '600' }}>
              {company}
            </div>
            {isInternship && (
              <div style={{ display: 'flex', padding: '6px 16px', borderRadius: '9999px', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)', color: '#c084fc', fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Internship
              </div>
            )}
          </div>
          
          <div style={{ fontSize: '72px', fontWeight: '800', lineHeight: 1.1, color: '#ffffff', maxWidth: '900px' }}>
            {title.length > 60 ? title.substring(0, 60) + '...' : title}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '28px', color: '#a1a1aa', marginTop: '16px' }}>
            <span style={{ color: '#f43f5e' }}>📍</span> {location}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '40px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: '#00F0FF', fontSize: '24px' }}>✓</span>
            <span style={{ fontSize: '24px', color: '#a1a1aa' }}>Direct Apply</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: '#00F0FF', fontSize: '24px' }}>✓</span>
            <span style={{ fontSize: '24px', color: '#a1a1aa' }}>Zero Dead Links</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
