/**
 * Giovanna Gama | Psicóloga Clínica - Scripts Interativos
 * Foco em acessibilidade, performance e CRO
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header Dinâmico: Oculto na Hero, visível nas demais seções
  const heroSection = document.querySelector('.hero-section');
  const headerWrapper = document.querySelector('.header-wrapper');

  if (heroSection && headerWrapper) {
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Se a hero NÃO está intersectando a tela (usuário rolou além dela), exibe o cabeçalho
        if (!entry.isIntersecting) {
          headerWrapper.classList.add('header-visible');
        } else {
          headerWrapper.classList.remove('header-visible');
        }
      });
    }, {
      root: null,
      threshold: 0.15
    });

    heroObserver.observe(heroSection);
  }

  // 2. Mobile Drawer Navigation
  const menuToggle = document.querySelector('.menu-toggle');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const drawerClose = document.querySelector('.mobile-drawer-close');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-drawer-content a');

  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', openDrawer);
  }

  if (drawerClose) {
    drawerClose.addEventListener('click', closeDrawer);
  }

  if (drawer) {
    drawer.addEventListener('click', (e) => {
      if (e.target === drawer) {
        closeDrawer();
      }
    });
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // 3. FAQ Accordion Single-Open Enhancement
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.open) {
            otherItem.removeAttribute('open');
          }
        });
      }
    });
  });

  // 4. Scroll Reveal Animation using IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal-fade-up');
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.12
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  // 5. Smooth Anchor Scroll with Fixed Header Offset
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId.startsWith('#')) return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerHeight = headerWrapper?.offsetHeight || 80;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - (headerHeight + 24);

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // 6. Animação de Entrada da Linha de Progressão e Pilares (Dobra 3)
  const progressionTrack = document.querySelector('.pilares-progression-track');
  if (progressionTrack) {
    if ('IntersectionObserver' in window) {
      const trackObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            progressionTrack.classList.add('is-animated');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.2
      });
      trackObserver.observe(progressionTrack);
    } else {
      progressionTrack.classList.add('is-animated');
    }
  }

  // 7. Abertura Editorial com Envelope e Selo de Cera (selo.png)
  const openingOverlay = document.getElementById('openingOverlay');
  if (openingOverlay) {
    let isTorn = false;
    let audioCtx = null;

    function getAudioContext() {
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          audioCtx = new AudioContextClass();
        }
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }
      return audioCtx;
    }

    // Efeito sonoro procedural de rasgo de papel e estalo de cera (Web Audio API)
    function playTearSound() {
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;

        // Estalo seco da cera quebrando
        const snapOsc = ctx.createOscillator();
        const snapGain = ctx.createGain();
        snapOsc.type = 'triangle';
        snapOsc.frequency.setValueAtTime(480, now);
        snapOsc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

        snapGain.gain.setValueAtTime(0.3, now);
        snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

        snapOsc.connect(snapGain);
        snapGain.connect(ctx.destination);
        snapOsc.start(now);
        snapOsc.stop(now + 0.1);

        // Fricção do papel rasgando
        const bufferSize = ctx.sampleRate * 1.2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1);
        }

        const noiseNode = ctx.createBufferSource();
        noiseNode.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1400, now);
        filter.frequency.linearRampToValueAtTime(750, now + 0.8);
        filter.Q.value = 3.0;

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.01, now);
        gainNode.gain.linearRampToValueAtTime(0.35, now + 0.06);
        gainNode.gain.setValueAtTime(0.25, now + 0.25);
        gainNode.gain.setValueAtTime(0.35, now + 0.45);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

        noiseNode.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        noiseNode.start(now);
        noiseNode.stop(now + 1.2);
      } catch (e) {
        // Ignora caso autoplay esteja bloqueado no navegador
      }
    }

    function openEnvelope() {
      if (isTorn) return;
      isTorn = true;
      playTearSound();
      openingOverlay.classList.add('torn-open');
      
      // Libera o scroll e atualiza os ScrollTriggers do GSAP após a abertura
      setTimeout(() => {
        document.body.classList.remove('opening-locked');
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.refresh();
        }
      }, 1500);
    }

    // Clique em qualquer lugar para rasgar o envelope
    openingOverlay.addEventListener('click', openEnvelope);

    // Abertura automática ao carregar a página
    window.addEventListener('load', () => {
      setTimeout(() => {
        openEnvelope();
      }, 650);
    });

    // Fallback de segurança para garantir abertura
    setTimeout(() => {
      if (!isTorn) {
        openEnvelope();
      }
    }, 2800);
  }

  // 8. GSAP ScrollTrigger
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Otimização crítica de estabilidade para Safari Mobile (iOS WebKit)
    // Impede recálculos provocados pela expansão/recolhimento da barra de endereços do iOS
    ScrollTrigger.config({
      ignoreMobileResize: true,
      fastScrollEnd: true
    });

    // 8.0. Parallax de Fundo na Dobra 3 (.approach-section)
    const approachSection = document.querySelector('.approach-section');
    const approachParallaxWrapper = document.querySelector('.approach-parallax-wrapper');

    if (approachSection && approachParallaxWrapper) {
      gsap.fromTo(approachParallaxWrapper, 
        { yPercent: -10 },
        {
          yPercent: 10,
          ease: 'none',
          scrollTrigger: {
            trigger: approachSection,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5,
            invalidateOnRefresh: true
          }
        }
      );
    }

    // Tríptico de Fases da Vida (Dobra 5)
    const tripticoSection = document.querySelector('.triptico-section');
    const cards = gsap.utils.toArray('.card-item');

    if (tripticoSection && cards.length === 3) {
      const totalCards = cards.length;
      const mm = gsap.matchMedia();

      mm.add({
        isDesktop: "(min-width: 768px)",
        isMobile: "(max-width: 767px)"
      }, (context) => {
        const { isDesktop } = context.conditions;

        // Configuração inicial dos cartões
        cards.forEach((card, index) => {
          const isFirst = index === 0;

          if (isDesktop) {
            // DESKTOP: Inicia todos empilhados no centro
            gsap.set(card, {
              zIndex: index === 0 ? 30 : (index === 1 ? 20 : 10),
              scale: isFirst ? 1 : 0.96,
              xPercent: 0,
              yPercent: isFirst ? 0 : 2,
              rotationZ: 0,
              rotationY: 0,
              rotationX: 0,
              filter: isFirst 
                ? 'drop-shadow(0 20px 35px rgba(0,0,0,0.65)) brightness(1)' 
                : 'drop-shadow(0 8px 16px rgba(0,0,0,0.45)) brightness(0.72)',
              opacity: 1,
              pointerEvents: 'auto',
              transformOrigin: 'center center',
              willChange: 'transform, filter'
            });
          } else {
            // MOBILE: Todos iniciam empilhados no centro (Card 0 no topo, Card 1 no meio, Card 2 na base)
            // COMPOSIÇÃO DE GPU PURA 2D: Sem filtros (drop-shadow/brightness/blur), sem scale, sem rotação
            gsap.set(card, {
              zIndex: (totalCards - index) * 10,
              scale: 1,
              xPercent: 0,
              yPercent: isFirst ? 0 : (index === 1 ? 4 : 8),
              rotationZ: 0,
              rotationY: 0,
              rotationX: 0,
              opacity: isFirst ? 1 : (index === 1 ? 0.85 : 0.7),
              pointerEvents: isFirst ? 'auto' : 'none',
              transformOrigin: 'center center',
              force3D: true,
              willChange: 'transform, opacity'
            });
          }
        });

        // Timeline vinculada ao scroll com pinning na seção
        const distancePerStep = isDesktop ? 800 : 600;
        const totalScrollDistance = (totalCards - 1) * distancePerStep;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: tripticoSection,
            start: 'top top',
            end: `+=${totalScrollDistance}`,
            pin: true,
            scrub: isDesktop ? 0.8 : 0.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (!isDesktop) {
                // Descarte imediato de pointer-events para estabilidade contra conflitos de toque no iOS
                const progress = self.progress;
                if (progress < 0.4) {
                  cards[0].style.pointerEvents = 'auto';
                  cards[1].style.pointerEvents = 'none';
                  cards[2].style.pointerEvents = 'none';
                } else if (progress < 0.85) {
                  cards[0].style.pointerEvents = 'none';
                  cards[1].style.pointerEvents = 'auto';
                  cards[2].style.pointerEvents = 'none';
                } else {
                  cards[0].style.pointerEvents = 'none';
                  cards[1].style.pointerEvents = 'none';
                  cards[2].style.pointerEvents = 'auto';
                }
              }
            }
          }
        });

        if (isDesktop) {
          // ===================================================================
          // DINÂMICA DESKTOP: Tríptico Horizontal
          // ===================================================================

          // ETAPA 1: Card 0 (Adolescentes) move-se para a esquerda (-106%)
          tl.to(cards[0], {
            xPercent: -106,
            yPercent: 0,
            rotationZ: -1.5,
            rotationY: 3,
            scale: 1,
            opacity: 1,
            ease: 'power2.inOut',
            duration: 1
          });

          // Concomitantemente, Card 1 (Jovens Adultos no centro) ganha foco e iluminação total
          tl.to(cards[1], {
            scale: 1,
            yPercent: 0,
            filter: 'drop-shadow(0 20px 35px rgba(0,0,0,0.65)) brightness(1)',
            ease: 'power2.inOut',
            duration: 1
          }, '<');

          // ETAPA 2: Card 2 (Adultos) move-se para a direita (+106%)
          tl.to(cards[2], {
            xPercent: 106,
            yPercent: 0,
            rotationZ: 1.5,
            rotationY: -3,
            scale: 1,
            opacity: 1,
            filter: 'drop-shadow(0 20px 35px rgba(0,0,0,0.65)) brightness(1)',
            ease: 'power2.inOut',
            duration: 1
          });

          // Interatividade 3D com o mouse nos cards abertos
          const handleMouseMove = (e) => {
            const rect = tripticoSection.getBoundingClientRect();
            const relX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
            const relY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

            cards.forEach((card, idx) => {
              const baseRotY = (idx === 0) ? 3 : (idx === 2 ? -3 : 0);
              gsap.to(card, {
                rotationY: baseRotY + relX * 4,
                rotationX: -relY * 4,
                duration: 0.35,
                ease: 'power1.out',
                overwrite: 'auto'
              });
            });
          };

          const handleMouseLeave = () => {
            cards.forEach((card, idx) => {
              const baseRotY = (idx === 0) ? 3 : (idx === 2 ? -3 : 0);
              gsap.to(card, {
                rotationY: baseRotY,
                rotationX: 0,
                duration: 0.4,
                ease: 'power2.out',
                overwrite: 'auto'
              });
            });
          };

          tripticoSection.addEventListener('mousemove', handleMouseMove);
          tripticoSection.addEventListener('mouseleave', handleMouseLeave);

          return () => {
            tripticoSection.removeEventListener('mousemove', handleMouseMove);
            tripticoSection.removeEventListener('mouseleave', handleMouseLeave);
          };

        } else {
          // ===================================================================
          // DINÂMICA MOBILE: COMPOSIÇÃO DE GPU PURA 2D (translate3d + opacity)
          // 100% livre de filtros (drop-shadow/brightness/blur), scale e rotation
          // Elimina o crash de memória/GPU e recarregamento no Safari iOS (Retina 3x)
          // ===================================================================

          // ETAPA 1: Card 0 (Adolescentes) sobe e sai da tela em 2D puro
          tl.to(cards[0], {
            yPercent: -130,
            opacity: 0,
            ease: 'power1.inOut',
            duration: 1,
            force3D: true,
            onComplete: () => { cards[0].style.pointerEvents = 'none'; },
            onReverseComplete: () => { cards[0].style.pointerEvents = 'auto'; }
          }, 'step1');

          // Concomitantemente, Card 1 (Jovens Adultos) sobe para foco pleno (2D puro)
          tl.to(cards[1], {
            yPercent: 0,
            opacity: 1,
            ease: 'power1.inOut',
            duration: 1,
            force3D: true,
            onStart: () => { cards[1].style.pointerEvents = 'auto'; },
            onReverseComplete: () => { cards[1].style.pointerEvents = 'none'; }
          }, 'step1');

          // Card 2 sobe suavemente de base (8%) para meio (4%)
          tl.to(cards[2], {
            yPercent: 4,
            opacity: 0.85,
            ease: 'power1.inOut',
            duration: 1,
            force3D: true
          }, 'step1');

          // ETAPA 2: Card 1 (Jovens Adultos) sobe e sai da tela em 2D puro
          tl.to(cards[1], {
            yPercent: -130,
            opacity: 0,
            ease: 'power1.inOut',
            duration: 1,
            force3D: true,
            onComplete: () => { cards[1].style.pointerEvents = 'none'; },
            onReverseComplete: () => { cards[1].style.pointerEvents = 'auto'; }
          }, 'step2');

          // Concomitantemente, Card 2 (Adultos) atinge o foco pleno no centro (2D puro)
          tl.to(cards[2], {
            yPercent: 0,
            opacity: 1,
            ease: 'power1.inOut',
            duration: 1,
            force3D: true,
            onStart: () => { cards[2].style.pointerEvents = 'auto'; },
            onReverseComplete: () => { cards[2].style.pointerEvents = 'none'; }
          }, 'step2');
        }
      });
    }
  }

  // =========================================================================
  // 9. [DOBRA 6] MODALIDADES DE ATENDIMENTO - ENVELOPES INTERATIVOS 3D
  // =========================================================================
  const envelopeCards = document.querySelectorAll('.vintage-envelope');

  if (envelopeCards.length > 0) {
    envelopeCards.forEach((envelope, index) => {
      const flap = envelope.querySelector('.envelope-flap');
      const photo = envelope.querySelector('.envelope-insert');
      const seal = envelope.querySelector('.envelope-seal');

      if (!flap || !photo) return;

      // Inclinação sutil e elegante da foto retrato ao emergir pela metade
      const photoTilt = (index === 0) ? -2.5 : 2.5;

      // Timeline GSAP
      const envelopeTimeline = gsap.timeline({ paused: true });

      envelopeTimeline
        // 1. A aba superior dobra em 3D abrindo o envelope
        .to(flap, {
          rotateX: 180,
          duration: 0.45,
          ease: 'power2.inOut'
        })
        // Move o z-index da aba para trás da foto que irá emergir
        .set(flap, { zIndex: 5 }, '-=0.15')
        // 2. A foto retrato emerge exatamente pela metade (~118px)
        .to(photo, {
          y: -118,
          rotation: photoTilt,
          scale: 1.02,
          duration: 0.65,
          ease: 'back.out(1.2)'
        }, '-=0.15')
        // 3. Suave escala do selo
        .to(seal, {
          scale: 0.9,
          opacity: 0.85,
          duration: 0.25
        }, '-=0.5');

      envelope._timeline = envelopeTimeline;
      envelope._isOpen = false;

      // Interações no Desktop (Hover com cursor)
      envelope.addEventListener('mouseenter', () => {
        if (window.innerWidth >= 1024) {
          envelopeTimeline.play();
          gsap.to(envelope, { y: -6, duration: 0.3, ease: 'power2.out' });
        }
      });

      envelope.addEventListener('mouseleave', () => {
        if (window.innerWidth >= 1024) {
          envelopeTimeline.reverse();
          gsap.to(envelope, { y: 0, duration: 0.35, ease: 'power2.out' });
        }
      });

      // Toque / Clique em qualquer dispositivo (não intercepta o clique no botão CTA de agendamento)
      envelope.addEventListener('click', (e) => {
        if (e.target.closest('.envelope-cta-btn')) return;

        if (envelope._isOpen) {
          envelopeTimeline.reverse();
          envelope._isOpen = false;
        } else {
          envelopeTimeline.play();
          envelope._isOpen = true;
        }
      });
    });

    // Configuração do GSAP ScrollTrigger para Mobile (<1024px)
    ScrollTrigger.matchMedia({
      '(max-width: 1023px)': function() {
        envelopeCards.forEach((envelope) => {
          const tl = envelope._timeline;
          if (!tl) return;

          ScrollTrigger.create({
            trigger: envelope,
            start: 'top 65%',
            end: 'bottom 20%',
            toggleActions: 'play reverse play reverse',
            onEnter: () => {
              tl.play();
              envelope._isOpen = true;
            },
            onLeave: () => {
              tl.reverse();
              envelope._isOpen = false;
            },
            onEnterBack: () => {
              tl.play();
              envelope._isOpen = true;
            },
            onLeaveBack: () => {
              tl.reverse();
              envelope._isOpen = false;
            }
          });
        });
      }
    });
  }

  // =========================================================================
  // 10. [SEÇÃO PRIMEIRO PASSO] PARALLAX DE FUNDO (DESKTOP & MOBILE)
  // =========================================================================
  const bottomCtaSection = document.querySelector('.bottom-cta-section');
  const bottomCtaParallaxWrapper = document.querySelector('.bottom-cta-parallax-wrapper');

  if (bottomCtaSection && bottomCtaParallaxWrapper) {
    gsap.fromTo(bottomCtaParallaxWrapper, 
      { yPercent: -15 },
      {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: bottomCtaSection,
          start: 'top bottom',
          end: 'bottom+=300 bottom',
          scrub: 0.3,
          invalidateOnRefresh: true,
          refreshPriority: -1
        }
      }
    );
  }

  // Parallax dos Pássaros Sobre a Seção
  const birdLeft = document.querySelector('.bottom-cta-bird.bird-top-left');
  const birdRight = document.querySelector('.bottom-cta-bird.bird-top-right');

  if (bottomCtaSection && birdLeft) {
    gsap.fromTo(birdLeft,
      { yPercent: -12, xPercent: -4, rotation: -2 },
      {
        yPercent: 24,
        xPercent: 5,
        rotation: 3,
        ease: 'none',
        scrollTrigger: {
          trigger: bottomCtaSection,
          start: 'top bottom',
          end: 'bottom+=300 bottom',
          scrub: 0.5,
          invalidateOnRefresh: true,
          refreshPriority: -1
        }
      }
    );
  }

  if (bottomCtaSection && birdRight) {
    gsap.fromTo(birdRight,
      { yPercent: -15, xPercent: 5, rotation: 3 },
      {
        yPercent: 28,
        xPercent: -4,
        rotation: -2,
        ease: 'none',
        scrollTrigger: {
          trigger: bottomCtaSection,
          start: 'top bottom',
          end: 'bottom+=300 bottom',
          scrub: 0.6,
          invalidateOnRefresh: true,
          refreshPriority: -1
        }
      }
    );
  }
});
