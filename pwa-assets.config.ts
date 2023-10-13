import { defineConfig, minimalPreset as preset } from '@vite-pwa/assets-generator/config'
import type { Preset } from '@vite-pwa/assets-generator/config';
import {AssetType, ResolvedAssetSize} from "@vite-pwa/assets-generator";

export const minimalPreset: Preset = {
    transparent: {
        sizes: [16, 32, 36, 48, 72, 96, 144, 150, 192, 512],
        favicons: [[64, 'favicon.ico']]
    },
    maskable: {
        sizes: [192,512]
    },
    apple: {
        sizes: [180]
    }
}

export default defineConfig({
    preset: {
        ...minimalPreset,
        assetName: (type: AssetType, size: ResolvedAssetSize) => {
            switch (type) {
                case 'transparent':
                    return `${size.width}x${size.height}.png`
                case 'maskable':
                    return `${size.width}x${size.height}-maskable.png`
                case 'apple':
                    return `${size.width}x${size.height}-apple.png`
            }
        },
    },
    images: ['public/img/icons/logo.svg']
})