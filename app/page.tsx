'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import {
  getPortfolioItems,
  getCategories,
  getGarmentTypes,
  getStore,
  getPrimaryImage,
  type PortfolioItem,
  type Category,
  type GarmentType,
  type Store,
} from '@/lib/data'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  Printer,
  Zap,
  Scissors,
  ChevronDown,
  Menu,
  X,
  MessageCircle,
  Package,
  Star,
  MapPin,
  Phone,
  Instagram,
  Check,
} from 'lucide-react'

// ============================================
// NAVBAR
// ============================================
function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Inicio', href: '#' },
    { label: 'Que hacemos', href: '#servicios' },
    { label: 'Trabajos', href: '#trabajos' },
    { label: 'Pedi el tuyo', href: '#pedido' },
    { label: 'Contacto', href: '#footer' },
  ]

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-black/95 backdrop-blur-md' : 'bg-black/80 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <a href="#" className="flex-shrink-0">
              <Image
                src="/logo.jpeg"
                alt="Zeus Indu"
                width={40}
                height={40}
                loading="eager"
                className="h-10 w-auto"
              />
            </a>
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="nav-link text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <a
              href="#pedido"
              className="hidden md:block bg-zeus-red text-black font-display text-sm px-5 py-2 hover:bg-red-600 transition-colors"
            >
              PEDI TU PRESUPUESTO
            </a>
            <button
              onClick={() => setIsOpen(true)}
              className="md:hidden p-2 text-white"
              aria-label="Abrir menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-zeus-red"
              aria-label="Cerrar menu"
            >
              <X size={32} />
            </button>
            <nav className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="font-display text-5xl text-white hover:text-zeus-red transition-colors"
                >
                  {link.label.toUpperCase()}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ============================================
// HERO SECTION
// ============================================
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center dot-grid-bg overflow-hidden bg-zeus-dark">
      <div className="absolute inset-0 bg-gradient-to-br from-zeus-red/10 via-transparent to-transparent opacity-60" />
      <svg
        className="absolute right-0 top-1/2 -translate-y-1/2 h-[80vh] w-auto opacity-[0.08] text-zeus-yellow"
        viewBox="0 0 100 200"
        fill="currentColor"
      >
        <polygon points="60,0 20,80 45,80 35,200 80,100 55,100" />
      </svg>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display text-zeus-red text-[2.5rem] sm:text-[3.5rem] md:text-[5rem] lg:text-[6rem] leading-none tracking-tight mb-4"
          >
            ZEUS INDU
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-2 border border-zinc-700 rounded-full text-xs text-zinc-400 mb-8"
          >
            <Zap size={14} className="text-zeus-yellow" />
            San Justo, Buenos Aires
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-display text-[4rem] sm:text-[5rem] md:text-[8rem] lg:text-[11rem] leading-[0.85] tracking-tight text-white"
          >
            <span className="relative inline-block">
              TU MARCA.
              <span className="absolute bottom-2 left-0 right-0 h-[3px] bg-zeus-red" />
            </span>
            <br />
            NUESTRAS
            <br />
            MANOS.
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="h-px bg-zeus-red w-full my-6 origin-left"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-lg text-zinc-400 max-w-xl leading-relaxed"
          >
            Estampados, sublimados y bordados para tu negocio, equipo o proyecto.
            Hacemos tu idea realidad, desde una unidad.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4 mt-10"
          >
            <a
              href="#pedido"
              className="shimmer-btn inline-flex items-center justify-center bg-zeus-yellow text-black font-display text-xl px-8 py-4 hover:bg-yellow-400 transition-colors"
            >
              PEDI TU PRESUPUESTO
            </a>
            <a
              href="#trabajos"
              className="inline-flex items-center justify-center text-white font-display text-xl px-8 py-4 hover:underline transition-all group"
            >
              VER TRABAJOS
              <span className="ml-2 group-hover:translate-x-1 transition-transform">-&gt;</span>
            </a>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown size={32} className="text-zinc-600 animate-bounce-slow" />
        </motion.div>
      </div>
    </section>
  )
}

// ============================================
// MARQUEE / TICKER
// ============================================
function MarqueeSection() {
  const items = 'SUBLIMADO - ESTAMPADO - BORDADO - SAN JUSTO - ZEUS INDU - ENTREGA RAPIDA - '
  const repeatedItems = items.repeat(10)
  return (
    <div className="bg-zeus-red py-3 overflow-hidden">
      <div className="animate-marquee whitespace-nowrap">
        <span className="font-display text-sm text-black tracking-wider">{repeatedItems}</span>
      </div>
    </div>
  )
}

// ============================================
// SERVICES SECTION
// ============================================
function ServicesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const services = [
    {
      icon: Printer,
      title: 'SUBLIMADO',
      description: 'Colores que no se van. Ideal para remeras, rompevientos, tazas y mas.',
    },
    {
      icon: Zap,
      title: 'ESTAMPADO',
      description: 'Transfer de alta calidad. Sin minimos desde una unidad hasta lo que necesitas.',
    },
    {
      icon: Scissors,
      title: 'BORDADO',
      description: 'El detalle que diferencia una marca. Gorras, camisas, buzos con identidad.',
    },
  ]
  return (
    <section id="servicios" className="bg-zeus-dark py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <p className="text-zeus-red text-sm font-display tracking-widest mb-4">01 - SERVICIOS</p>
          <h2 className="font-display text-5xl md:text-7xl text-white">LO QUE HACEMOS</h2>
        </div>
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-px">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="bg-zeus-mid p-8 border-l-4 border-zeus-red group hover:-translate-y-2 transition-all duration-300 card-glow cursor-default"
            >
              <service.icon
                size={32}
                className="text-zinc-600 group-hover:text-zeus-yellow transition-colors duration-300 mb-6"
              />
              <h3 className="font-display text-3xl text-white mb-4">{service.title}</h3>
              <p className="text-zinc-400 leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================
// GALLERY SECTION
// ============================================
function GallerySection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [activeTechnique, setActiveTechnique] = useState('todos')
  const [activeGarment, setActiveGarment] = useState('todas')
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [garmentTypes, setGarmentTypes] = useState<GarmentType[]>([])
  const [loadingGallery, setLoadingGallery] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [items, cats, garments] = await Promise.all([
          getPortfolioItems(),
          getCategories(),
          getGarmentTypes(),
        ])
        setPortfolioItems(items)
        setCategories(cats)
        setGarmentTypes(garments)
      } catch (err) {
        console.error('Error loading gallery data:', err)
      } finally {
        setLoadingGallery(false)
      }
    }
    load()
  }, [])

  const handleTechniqueChange = (value: string) => {
    setActiveTechnique(value)
    setActiveGarment('todas')
  }

  const filtered = portfolioItems.filter((item) => {
    const techniqueMatch = activeTechnique === 'todos' || item.categories?.slug === activeTechnique
    const garmentMatch = activeGarment === 'todas' || item.garment_type === activeGarment
    return techniqueMatch && garmentMatch
  })

  const resetFilters = () => {
    setActiveTechnique('todos')
    setActiveGarment('todas')
  }

  return (
    <section id="trabajos" className="bg-black py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <p className="text-zeus-red text-sm font-display tracking-widest mb-4">02 - TRABAJOS</p>
          <h2 className="font-display text-5xl md:text-7xl text-white">ALGUNOS TRABAJOS</h2>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {[{ label: 'TODOS', value: 'todos' }, ...categories.map(c => ({ label: c.name.toUpperCase(), value: c.slug }))].map((t) => (
            <button
              key={t.value}
              onClick={() => handleTechniqueChange(t.value)}
              className={`px-4 py-2 font-display text-sm tracking-widest transition-all duration-200 ${
                activeTechnique === t.value
                  ? 'bg-zeus-red text-white'
                  : 'border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-12">
          {[{ label: 'TODAS', value: 'todas' }, ...garmentTypes.map(g => ({ label: g.name.toUpperCase(), value: g.slug }))].map((g) => (
            <button
              key={g.value}
              onClick={() => setActiveGarment(g.value)}
              className={`px-3 py-1.5 font-display text-xs tracking-widest transition-all duration-200 ${
                activeGarment === g.value
                  ? 'bg-zinc-700 text-white'
                  : 'border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loadingGallery ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/5] animate-pulse"
                style={{ backgroundColor: '#1a1a1a' }}
              />
            ))
          ) : (
            <AnimatePresence mode="popLayout">
              {filtered.length > 0 &&
                filtered.map((item) => {
                  const imageUrl = getPrimaryImage(item.product_images)
                  const garmentDisplay = item.garment_type
                    ? item.garment_type.charAt(0).toUpperCase() + item.garment_type.slice(1)
                    : ''
                  const categoryName = item.categories?.name ?? ''
                  const label = categoryName
                    ? `${categoryName} - ${garmentDisplay}`
                    : garmentDisplay
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="aspect-[4/5] gallery-card relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={label}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                          <span className="text-zinc-500 font-display text-sm tracking-widest">
                            {categoryName.toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-zeus-red/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                        <p className="font-display text-white text-lg">{label}</p>
                      </div>
                    </motion.div>
                  )
                })}
            </AnimatePresence>
          )}
        </div>

        {!loadingGallery && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-zinc-500 font-sans mb-4">No hay trabajos con esa combinacion todavia.</p>
            <button
              onClick={resetFilters}
              className="text-zeus-red text-sm hover:underline transition-all"
            >
              Ver todos los trabajos &rarr;
            </button>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <h3 className="font-display text-3xl md:text-4xl text-white mb-4">Queres algo asi?</h3>
          <p className="text-zinc-400 mb-8">Mandanos tu idea y en menos de 24hs te respondemos.</p>
          <a
            href="#pedido"
            className="shimmer-btn inline-flex items-center justify-center bg-zeus-red text-white font-display text-lg px-8 py-4 hover:bg-red-600 transition-colors"
          >
            EMPEZAR PEDIDO
          </a>
        </motion.div>
      </div>
    </section>
  )
}

// ============================================
// WHY ZEUS SECTION
// ============================================
function WhyZeusSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const features = [
    { icon: Zap, title: 'Entrega rapida', description: 'Turnos agiles para que nunca llegues tarde a tu cliente.' },
    { icon: Package, title: 'Sin minimos', description: 'Desde una unidad. Proba, ajusta, escala cuando quieras.' },
    { icon: MessageCircle, title: 'Atencion directa', description: 'Hablas con quien hace el trabajo. Sin intermediarios.' },
    { icon: Star, title: 'Calidad garantizada', description: 'Revisamos cada prenda antes de entregartela.' },
  ]
  const stats = [
    { value: 500, suffix: '+', label: 'pedidos entregados' },
    { value: 3, suffix: '', label: 'anos en el rubro' },
    { value: 100, suffix: '%', label: 'clientes satisfechos' },
  ]
  return (
    <section className="bg-zeus-dark py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <p className="text-zeus-red text-sm font-display tracking-widest mb-4">03 - DIFERENCIAL</p>
          <h2 className="font-display text-5xl md:text-7xl text-white">POR QUE ZEUS INDU?</h2>
        </div>
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="flex items-start gap-5"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-zeus-red/20 flex items-center justify-center">
                <feature.icon size={24} className="text-zeus-red" />
              </div>
              <div>
                <h3 className="font-display text-2xl text-white mb-2">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="bg-zeus-mid p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, i) => (
              <StatCounter key={stat.label} stat={stat} delay={i * 0.2} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function StatCounter({ stat, delay }: { stat: { value: number; suffix: string; label: string }; delay: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!isInView) return
    const duration = 2000
    const steps = 60
    const increment = stat.value / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= stat.value) {
        setCount(stat.value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [isInView, stat.value])
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay }}
    >
      <p className="font-display text-5xl md:text-6xl text-zeus-red">{count}{stat.suffix}</p>
      <p className="text-zinc-400 mt-2">{stat.label}</p>
    </motion.div>
  )
}

// ============================================
// ORDER FORM SECTION
// ============================================
function OrderSection({ store }: { store: Store | null }) {
  const [message, setMessage] = useState('')
  const handleWhatsApp = () => {
    const whatsappUrl = `https://wa.me/${store?.whatsapp_number ?? '541127129548'}?text=${encodeURIComponent(
      (store?.whatsapp_message_template ?? '¡Hola! Me comunico desde la web.') + '\n\n' + (message || 'Hola! Quiero hacer un pedido.')
    )}`
    window.open(whatsappUrl, '_blank')
  }
  const checklistItems = [
    'Que prenda o producto queres? (ej: camisetas, gorras, buzos, bolsas, tazas)',
    'Tecnica: sublimado, estampado o bordado (o preguntanos cual conviene)',
    'Cantidad aproximada',
    'Tenes el diseno o necesitas que te lo hagamos?',
    'Fecha de entrega que necesitas',
    'Cualquier detalle extra (colores, talles, medidas)',
  ]
  return (
    <section id="pedido" className="bg-black py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <p className="text-zeus-red text-sm font-display tracking-widest mb-4">04 - CONTACTO</p>
          <h2 className="font-display text-5xl md:text-7xl text-white">PEDI EL TUYO</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-zeus-mid border-l-4 border-zeus-red rounded-r-xl p-8">
            <h3 className="font-display text-2xl text-white mb-4">COMO HACER TU PEDIDO</h3>
            <p className="text-zinc-400 mb-6">Para que te podamos cotizar rapido, contanos:</p>
            <ul className="space-y-4">
              {checklistItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check size={18} className="text-zeus-yellow flex-shrink-0 mt-1" />
                  <span className="text-zinc-300 text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 p-4 bg-black/50 rounded-lg">
              <p className="text-sm text-zinc-400">
                <span className="text-zeus-yellow">Tip:</span> Cuanto mas detallado, mas rapido te respondemos.
              </p>
            </div>
          </div>
          <div>
            <label className="block font-display text-sm text-zinc-500 tracking-widest mb-3">
              TU MENSAJE
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ej: Necesito 30 remeras talle M y L sublimadas full print, tengo el diseno en PNG, para el 20 del mes..."
              className="w-full min-h-[200px] bg-zeus-dark border border-zinc-800 focus:border-zeus-red focus:outline-none rounded-xl p-5 text-white text-sm resize-none transition-colors"
            />
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleWhatsApp}
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-display text-lg py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle size={20} />
                ENVIAR POR WHATSAPP
              </button>
              <a
                href="https://www.instagram.com/zeusindu"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full border border-zinc-700 hover:border-zeus-red text-zinc-400 hover:text-white font-display text-lg py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Instagram size={20} />
                INSTAGRAM @ZEUSINDU
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================
// FOOTER
// ============================================
function Footer() {
  return (
    <footer id="footer" className="bg-black border-t border-zinc-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <Image src="/logo.jpeg" alt="Zeus Indu" width={64} height={64} className="h-16 w-auto mb-4" />
            <p className="text-zinc-400 text-sm leading-relaxed">
              Tu taller de indumentaria personalizada en el oeste del GBA.
            </p>
          </div>
          <div>
            <h4 className="font-display text-zinc-500 mb-4">CONTACTO</h4>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-zeus-red" />
                Monsenor Marcon 2126, San Justo, Bs As
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-zeus-red" />
                11 2712-9548
              </li>
              <li className="flex items-center gap-2">
                <Instagram size={16} className="text-zeus-red" />
                @zeusindu
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-zinc-500 mb-4">HORARIOS</h4>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Lunes a Viernes<br />Consultar disponibilidad por WhatsApp
            </p>
          </div>
        </div>
        <div className="border-t border-zinc-900 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-zinc-600">
          <p>2025 Zeus Indu. Todos los derechos reservados.</p>
          <p>Hecho con en San Justo</p>
        </div>
      </div>
    </footer>
  )
}

// ============================================
// FLOATING WHATSAPP BUTTON
// ============================================
function WhatsAppButton({ store }: { store: Store | null }) {
  return (
    <motion.a
      href={`https://wa.me/${store?.whatsapp_number ?? '541127129548'}`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-xl hover:scale-110 hover:bg-[#20bd5a] transition-transform whatsapp-pulse"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle size={26} className="text-white" />
    </motion.a>
  )
}

// ============================================
// MAIN PAGE
// ============================================
export default function Home() {
  const [store, setStore] = useState<Store | null>(null)

  useEffect(() => {
    getStore()
      .then(setStore)
      .catch(console.error)
  }, [])

  return (
    <main className="bg-black min-h-screen">
      <Navbar />
      <HeroSection />
      <MarqueeSection />
      <ServicesSection />
      <GallerySection />
      <WhyZeusSection />
      <OrderSection store={store} />
      <Footer />
      <WhatsAppButton store={store} />
    </main>
  )
}