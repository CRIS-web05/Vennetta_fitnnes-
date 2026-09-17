import React, { useRef, useState, useEffect } from 'react';

function LazyVideo({ src, className, autoPlay, loop, muted, playsInline, preload, subtitleText, title }) {
  const [isIntersecting, setIntersecting] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIntersecting(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className={className} style={{ width: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {isIntersecting ? (
        <>
          <video 
            src={src} 
            autoPlay={autoPlay} 
            loop={loop} 
            muted={muted} 
            playsInline={playsInline} 
            preload={preload || 'metadata'} 
            aria-label={title || "Video de entrenamiento Vendetta Fitness"}
            style={{ width: '100%', display: 'block' }}
          >
            <track kind="subtitles" srcLang="es" label="Español" default />
            <track kind="subtitles" srcLang="en" label="English" />
          </video>
          {subtitleText && (
            <div 
              className="video-subtitle-overlay"
              style={{
                position: 'absolute',
                bottom: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(0, 0, 0, 0.82)',
                color: '#fff',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                textAlign: 'center',
                maxWidth: '90%',
                zIndex: 5,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                pointerEvents: 'none'
              }}
            >
              💬 CC: {subtitleText}
            </div>
          )}
        </>
      ) : (
        <div style={{ width: '100%', minHeight: '300px', background: 'transparent' }} />
      )}
    </div>
  );
}

export default LazyVideo;
