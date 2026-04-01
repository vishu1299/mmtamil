import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			playfair: ['var(--font-playfair)', 'serif'],
  			inter: ['var(--font-inter)', 'sans-serif'],
  			sfpro: ['"SF Pro Display"', '"SF Pro"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
  		},
  		colors: {
  			'pink-mmm': '#EF4765',
  			'dark-mmm': '#333333',
  			'smoke-mmm': '#f5f5f5',
  			maroon: {
  				DEFAULT: '#8D1B3D',
  				light: '#C44569',
  			},
  			gold: {
  				DEFAULT: '#D4AF37',
  				light: '#F5E6A7',
  			},
  			cream: '#FFF8F5',
  			'soft-rose': '#F8E8EC',
  			'border-soft': '#EADDDD',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		boxShadow: {
  			card: '0 4px 24px -4px rgba(45, 24, 35, 0.08), 0 2px 8px -2px rgba(45, 24, 35, 0.06)',
  			'card-hover': '0 18px 48px -12px rgba(45, 24, 35, 0.14), 0 8px 20px -6px rgba(45, 24, 35, 0.09)',
  			header: '0 1px 0 0 rgba(141, 27, 61, 0.07), 0 6px 24px -6px rgba(45, 24, 35, 0.08)',
  			soft: '0 2px 14px -2px rgba(45, 24, 35, 0.07)',
  			'soft-lg': '0 10px 32px -8px rgba(45, 24, 35, 0.11)',
  			maroon: '0 6px 20px -4px rgba(141, 27, 61, 0.2)',
  			'maroon-lg': '0 12px 32px -6px rgba(141, 27, 61, 0.28)',
  			'nav-up': '0 -4px 24px -4px rgba(45, 24, 35, 0.1)',
  			'footer-up': '0 -6px 28px -8px rgba(45, 24, 35, 0.08)'
  		},
  		transitionDuration: {
  			'250': '250ms'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			'fade-in': {
  				from: {
  					opacity: '0',
  					transform: 'translateY(6px)'
  				},
  				to: {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'fade-in': 'fade-in 0.4s ease-out both'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
