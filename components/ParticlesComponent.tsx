"use client";

import { useEffect } from 'react';
import Script from 'next/script';

// This is to declare the particlesJS function to TypeScript
declare global {
    interface Window {
        particlesJS: any;
    }
}

const ParticlesComponent = () => {
    useEffect(() => {
        const loadParticles = () => {
            if (window.particlesJS) {
                window.particlesJS("particles-js", {
                    "particles": {
                        "number": { "value": 200, "density": { "enable": true, "value_area": 800 } },
                        "color": { "value": "#ffffff" },
                        "shape": { "type": "circle", "stroke": { "width": 0, "color": "#000000" } },
                        "opacity": { "value": 0.4, "random": false, "anim": { "enable": false, "speed": 1, "opacity_min": 0.1, "sync": false } },
                        "size": { "value": 2, "random": true, "anim": { "enable": false, "speed": 40, "size_min": 0.1, "sync": false } },
                        "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.3, "width": 1 },
                        "move": { "enable": true, "speed": 2, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false, "attract": { "enable": false, "rotateX": 600, "rotateY": 1200 } }
                    },
                    "interactivity": {
                        "detect_on": "canvas",
                        "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" }, "resize": true },
                        "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 1 } }, "repulse": { "distance": 200, "duration": 0.4 }, "push": { "particles_nb": 4 }, "remove": { "particles_nb": 2 } }
                    },
                    "retina_detect": true
                });
            }
        };
        // Ensure the script is loaded before calling the function
        if (document.querySelector('script[src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"]')) {
            loadParticles();
        }
    }, []);

    return (
        <>
            <div id="particles-js" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}></div>
            <Script
                src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"
                strategy="lazyOnload"
                onLoad={() => {
                     // The script has loaded, now you can safely initialize particles.js
                    if (window.particlesJS) {
                        // Re-running the initialization from the useEffect to be safe
                        window.particlesJS("particles-js", {
                            "particles": { "number": { "value": 200, "density": { "enable": true, "value_area": 800 } }, "color": { "value": "#ffffff" }, "shape": { "type": "circle", "stroke": { "width": 0, "color": "#000000" } }, "opacity": { "value": 0.4, "random": false, "anim": { "enable": false, "speed": 1, "opacity_min": 0.1, "sync": false } }, "size": { "value": 2, "random": true, "anim": { "enable": false, "speed": 40, "size_min": 0.1, "sync": false } }, "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.3, "width": 1 }, "move": { "enable": true, "speed": 2, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false, "attract": { "enable": false, "rotateX": 600, "rotateY": 1200 } } },
                            "interactivity": { "detect_on": "canvas", "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" }, "resize": true }, "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 1 } }, "repulse": { "distance": 200, "duration": 0.4 }, "push": { "particles_nb": 4 }, "remove": { "particles_nb": 2 } } }, "retina_detect": true
                        });
                    }
                }}
            />
        </>
    );
};

export default ParticlesComponent;