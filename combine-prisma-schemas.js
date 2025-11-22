const fs = require('fs');
const path = require('path');
const { globSync } = require('glob'); // Usando a versão síncrona para simplicidade

function combineSchemas() {
  const HEADER = `// ------------------------------------------------ //
// THIS FILE IS AUTO-GENERATED. DO NOT EDIT DIRECTLY. //
// ------------------------------------------------ //\n\n`;

  // process.cwd() refere-se à raiz do projeto, onde você executa 'npm run'
  const projectRoot = process.cwd();
  const basePath = path.join(projectRoot, 'prisma', '_base.prisma');
  const modelsPath = path.join(projectRoot, 'prisma', 'models');
  const outputPath = path.join(projectRoot, 'prisma', 'schema.prisma');
  
  // Normaliza o caminho para funcionar em Windows e Unix
  const searchPattern = path.join(modelsPath, '*.prisma').replace(/\\/g, '/');

  try {
    console.log('🔄 Combining Prisma schemas...');

    if (!fs.existsSync(basePath)) {
      console.error(`❌ Error: Base schema file not found at ${path.relative(projectRoot, basePath)}`);
      process.exit(1);
    }
    const baseContent = fs.readFileSync(basePath, 'utf-8');
    
    const modelFiles = globSync(searchPattern);

    if (modelFiles.length === 0) {
      console.warn(`⚠️ Warning: No model files found in ${path.relative(projectRoot, modelsPath)}`);
    }
    
    let combinedContent = HEADER + baseContent + '\n\n';

    // Ordena os arquivos para uma ordem consistente
    for (const file of modelFiles.sort()) {
      const modelContent = fs.readFileSync(file, 'utf-8');
      combinedContent += modelContent + '\n\n';
      console.log(`  ➕ Appending ${path.basename(file)}`);
    }

    fs.writeFileSync(outputPath, combinedContent.trim() + '\n');
    console.log(`✅ Prisma schema combined successfully at ${path.relative(projectRoot, outputPath)}!`);

  } catch (error) {
    console.error('❌ Error combining Prisma schemas:', error);
    process.exit(1);
  }
}

combineSchemas();