import sharp from 'sharp';
import { readdir, mkdir } from 'fs/promises';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PUBLIC_DIR = join(__dirname, '..', 'public');
const OUTPUT_DIR = join(PUBLIC_DIR, 'optimized');

// Responsive image sizes
const SIZES = [
    { name: 'thumb', width: 320 },
    { name: 'small', width: 640 },
    { name: 'medium', width: 1024 },
    { name: 'large', width: 1920 }
];

// LQIP (Low Quality Image Placeholder) size
const LQIP_SIZE = 20;

async function ensureDir(dir) {
    try {
        await mkdir(dir, { recursive: true });
    } catch (err) {
        if (err.code !== 'EEXIST') throw err;
    }
}

async function convertImage(inputPath, outputDir, filename) {
    const nameWithoutExt = basename(filename, extname(filename));
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    console.log(`Processing: ${filename} (${metadata.width}x${metadata.height})`);

    // Create LQIP (blur placeholder)
    await image
        .clone()
        .resize(LQIP_SIZE, LQIP_SIZE, { fit: 'inside' })
        .webp({ quality: 20 })
        .toFile(join(outputDir, `${nameWithoutExt}-lqip.webp`));

    // Create responsive sizes
    for (const size of SIZES) {
        // Only create size if original is larger
        if (metadata.width >= size.width) {
            await image
                .clone()
                .resize(size.width, null, {
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .webp({ quality: 85 })
                .toFile(join(outputDir, `${nameWithoutExt}-${size.name}.webp`));
        }
    }

    // Create full-size WebP
    await image
        .clone()
        .webp({ quality: 85 })
        .toFile(join(outputDir, `${nameWithoutExt}.webp`));
}

async function processImages() {
    console.log('🖼️  Starting image conversion...\n');

    await ensureDir(OUTPUT_DIR);

    const files = await readdir(PUBLIC_DIR);
    const imageFiles = files.filter(file =>
        /\.(jpg|jpeg|png)$/i.test(file)
    );

    console.log(`Found ${imageFiles.length} images to convert\n`);

    let processed = 0;
    for (const file of imageFiles) {
        try {
            const inputPath = join(PUBLIC_DIR, file);
            await convertImage(inputPath, OUTPUT_DIR, file);
            processed++;
            console.log(`✓ Converted ${file} (${processed}/${imageFiles.length})\n`);
        } catch (err) {
            console.error(`✗ Failed to convert ${file}:`, err.message);
        }
    }

    console.log(`\n✨ Done! Converted ${processed} images to WebP format`);
    console.log(`📁 Output directory: ${OUTPUT_DIR}`);
}

processImages().catch(console.error);
