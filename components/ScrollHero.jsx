"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 58, text: "Increase in pick-up point use" },
  { value: 27, text: "Decrease in customer phone calls" },
  { value: 23, text: "Faster hand-offs at the counter" },
  { value: 40, text: "Fewer missed deliveries" }
];

export default function ScrollHero() {
  const trackRef = useRef(null);
  const carRef = useRef(null);
  const sunRef = useRef(null);
  const popRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const letters = gsap.utils.toArray(".hero-letter");
      const statCards = gsap.utils.toArray(".hero-stat");
      const clouds = gsap.utils.toArray(".cloud");
      const wheel1 = document.querySelector("#wheel1");
      const wheel2 = document.querySelector("#wheel2");

      const intro = gsap.timeline({
        defaults: { ease: "power4.out" }
      });

      intro
        .from(letters, {
          y: 70,
          opacity: 0,
          rotateX: -70,
          duration: 0.9,
          stagger: 0.045
        })
        .from(
          statCards,
          {
            y: 35,
            opacity: 0,
            duration: 0.65,
            stagger: 0.1
          },
          "-=0.35"
        )
        .from(
          carRef.current,
          {
            opacity: 0,
            x: -160,
            duration: 0.9
          },
          "-=0.45"
        );

      // Count-up stats on initial load.
      statCards.forEach((card, index) => {
        const number = card.querySelector(".stat-number");
        const target = Number(number.dataset.value);
        const counter = { value: 0 };

        gsap.to(counter, {
          value: target,
          duration: 1.25,
          delay: 0.45 + index * 0.12,
          ease: "power2.out",
          onUpdate: () => {
            number.textContent = `${Math.round(counter.value)}%`;
          }
        });
      });

      // Main scroll-driven animation.
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: trackRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.1,
          invalidateOnRefresh: true
        }
      });

      // Sun travels slowly through the sky.
      timeline.to(
        sunRef.current,
        {
          x: () => window.innerWidth * 0.14,
          y: 100,
          scale: 1.1,
          duration: 1
        },
        0
      );

      // Clouds drift at different speeds to create a beach-sky parallax.
      clouds.forEach((cloud, index) => {
        timeline.to(
          cloud,
          {
            x: () => -(window.innerWidth * (0.12 + index * 0.09)),
            y: index === 1 ? 18 : -8,
            duration: 1
          },
          0
        );
      });

      // Car stays on the road during the main drive.
      timeline.fromTo(
        carRef.current,
        {
          x: () => -window.innerWidth * 0.18,
          y: 0,
          scale: 0.72,
          rotation: 0
        },
        {
          x: () => window.innerWidth * 0.72,
          y: 0,
          scale: 1,
          rotation: 0,
          duration: 0.72
        },
        0
      );

      // Wheels rotate with scroll progress.
      timeline.to(
        wheel1,
        {
          rotation: 1440,
          svgOrigin: "105 118",
          duration: 1
        },
        0
      );

      timeline.to(
        wheel2,
        {
          rotation: 1440,
          svgOrigin: "305 118",
          duration: 1
        },
        0
      );

      // Headline exits smoothly.
      timeline.to(
        letters,
        {
          x: (index) => (index - 7) * 12,
          y: (index) => (index % 2 ? -38 : 38),
          rotation: (index) => (index % 2 ? 3 : -3),
          opacity: 0,
          duration: 0.42,
          stagger: 0.012,
          ease: "power2.in"
        },
        0.08
      );

      // Stats drift away.
      timeline.to(
        statsRef.current,
        {
          y: -100,
          opacity: 0,
          duration: 0.32,
          ease: "power2.in"
        },
        0.14
      );

      // Final launch.
      timeline.to(
        carRef.current,
        {
          x: () => window.innerWidth * 1.2,
          y: -75,
          rotation: -8,
          scale: 1.15,
          duration: 0.18,
          ease: "power2.in"
        },
        0.72
      );

      timeline.to(
        popRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: 0.2,
          ease: "back.out(2)"
        },
        0.82
      );
    }, trackRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={trackRef} className="hero-track">
      <section className="hero-stage">
        <div className="sun" ref={sunRef} />

        <div className="cloud cloud-one">
          <span />
          <span />
        </div>

        <div className="cloud cloud-two">
          <span />
          <span />
        </div>

        <div className="cloud cloud-three">
          <span />
          <span />
        </div>

        <div className="palm palm-one">🌴</div>
        <div className="palm palm-two">🌴</div>

        <div className="hero-content">
          <h1 className="headline" aria-label="Welcome Itzfizz">
            {"WELCOME ITZFIZZ".split("").map((letter, index) => (
              <span className="hero-letter" key={index}>
                {letter === " " ? "\u00A0" : letter}
              </span>
            ))}
          </h1>

          <div className="stats" ref={statsRef}>
            {stats.map((stat) => (
              <div className="hero-stat" key={stat.text}>
                <strong
                  className="stat-number"
                  data-value={stat.value}
                >
                  0%
                </strong>

                <div className="stat-line">
                  <span style={{ width: `${stat.value}%` }} />
                </div>

                <p>{stat.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="beach">
          <div className="water" />
          <div className="sand" />
        </div>

        <div className="road">
          <div className="road-line" />
          <div className="road-edge road-edge-top" />
          <div className="road-edge road-edge-bottom" />
        </div>

        <div className="car" ref={carRef} aria-hidden="true">
          <svg viewBox="0 0 400 150" fill="none">
            <path
              d="M18 100c0-14 6-22 20-26l58-10c14-16 34-30 62-30h64c26 0 46 12 62 34l52 10c14 3 22 10 22 24v6c0 6-4 10-10 10H28c-6 0-10-4-10-10z"
              fill="#FFE94A"
              stroke="#0D0A2E"
              strokeWidth="6"
              strokeLinejoin="round"
            />

            <path
              d="M120 66c12-12 26-22 46-22h54v24H120z"
              fill="#2416FF"
              stroke="#0D0A2E"
              strokeWidth="5"
            />

            <path
              d="M236 44h14c16 0 30 8 42 24h-56z"
              fill="#2416FF"
              stroke="#0D0A2E"
              strokeWidth="5"
            />

            <rect
              x="24"
              y="92"
              width="26"
              height="10"
              rx="4"
              fill="#FF8FD8"
            />

            <rect
              x="350"
              y="86"
              width="26"
              height="12"
              rx="4"
              fill="#fff"
            />

            <g id="wheel1">
              <circle cx="105" cy="118" r="26" fill="#0D0A2E" />
              <circle cx="105" cy="118" r="12" fill="#FF8FD8" />
              <path
                d="M105 96v44M83 118h44"
                stroke="#FFE94A"
                strokeWidth="5"
              />
            </g>

            <g id="wheel2">
              <circle cx="305" cy="118" r="26" fill="#0D0A2E" />
              <circle cx="305" cy="118" r="12" fill="#FF8FD8" />
              <path
                d="M305 96v44M283 118h44"
                stroke="#FFE94A"
                strokeWidth="5"
              />
            </g>
          </svg>
        </div>

        <div className="pop" ref={popRef}>
          FIZZ
          <br />
          ON.
        </div>

        <div className="scroll-hint">SCROLL ↓</div>
      </section>
    </main>
  );
}
