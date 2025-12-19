import React, { useState, useEffect } from 'react';
import { FaPause, FaPlay } from 'react-icons/fa';
import './Hero.css';

const slides = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        title: 'Timeless Elegance',
        subtitle: 'Discover our exclusive collection of handcrafted jewelry.'
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        title: 'Shine Bright',
        subtitle: 'Luxury pieces that make every moment special.'
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        title: 'Modern Sophistication',
        subtitle: 'Contemporary designs for the modern you.'
    }
];

const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const [isPaused, setIsPaused] = useState(false);

    // Clone the first slide and add it to the end
    const extendedSlides = [...slides, { ...slides[0], id: 'clone' }];

    useEffect(() => {
        if (isPaused) return; // Don't auto-advance when paused

        const interval = setInterval(() => {
            setCurrentSlide((prev) => prev + 1);
            setIsTransitioning(true);
        }, 4000);

        return () => clearInterval(interval);
    }, [isPaused]);

    useEffect(() => {
        if (currentSlide === slides.length) {
            // We reached the clone. Wait for animation to finish, then reset instantly.
            const timeout = setTimeout(() => {
                setIsTransitioning(false);
                setCurrentSlide(0);
            }, 1000); // Matches CSS transition duration

            return () => clearTimeout(timeout);
        }
    }, [currentSlide]);

    const togglePause = () => {
        setIsPaused(!isPaused);
    };

    return (
        <section className="hero" id="home">
            <div
                className="hero-slider"
                style={{
                    transform: `translateX(-${currentSlide * 100}%)`,
                    transition: isTransitioning ? 'transform 1s ease-in-out' : 'none'
                }}
            >
                {extendedSlides.map((slide) => (
                    <div
                        key={slide.id}
                        className="hero-slide"
                        style={{
                            backgroundImage: `linear-gradient(rgba(255, 240, 245, 0.6), rgba(255, 240, 245, 0.4)), url('${slide.image}')`
                        }}
                    >
                        <div className="hero-content">
                            <h1 className="hero-title glow-text">{slide.title}</h1>
                            <p className="hero-subtitle">{slide.subtitle}</p>
                            <a href="#rings" className="btn hero-btn">Shop Now</a>
                        </div>
                    </div>
                ))}
            </div>

            <button
                className="hero-pause-btn"
                onClick={togglePause}
                title={isPaused ? "Play slideshow" : "Pause slideshow"}
            >
                {isPaused ? <FaPlay /> : <FaPause />}
            </button>

            <div className="hero-dots">
                {slides.map((_, index) => (
                    <span
                        key={index}
                        className={`dot ${index === (currentSlide % slides.length) ? 'active' : ''}`}
                        onClick={() => {
                            setIsTransitioning(true);
                            setCurrentSlide(index);
                        }}
                    ></span>
                ))}
            </div>
        </section>
    );
};

export default Hero;
