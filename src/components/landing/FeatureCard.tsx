import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    delay?: number;
}

export function FeatureCard({
    icon: Icon,
    title,
    description,
    delay = 0,
}: FeatureCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay, ease: [0.25, 0.4, 0.25, 1] }}
            className="group"
        >
            <div className="bg-white rounded-2xl p-8 shadow-zen hover-lift h-full border border-border/50">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-cream flex items-center justify-center mb-6 group-hover:bg-apricot/20 transition-colors duration-300">
                    <Icon className="w-6 h-6 text-sumi" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-sumi mb-3 font-serif">{title}</h3>
                <p className="text-sumi-500 leading-relaxed">{description}</p>
            </div>
        </motion.div>
    );
}
