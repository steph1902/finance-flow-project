module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            'nativewind/babel',
            [
                'module-resolver',
                {
                    root: ['./'],
                    alias: {
                        '@': './src',
                        '@/components': './src/components',
                        '@/screens': './src/screens',
                        '@/hooks': './src/hooks',
                        '@/services': './src/services',
                        '@/types': './src/types',
                        '@/context': './src/context',
                        '@/utils': './src/utils',
                        '@/config': './src/config',
                    },
                },
            ],
        ],
    };
};
