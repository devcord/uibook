const fs = require('fs')
const path = require('path')
const glob = require('glob')
const templateCompiler = require('vue-template-compiler')
const hash = require('hash-sum')

const parse = require('@vue/component-compiler-utils').parse
const assemble = require('@vue/component-compiler').assemble
const createDefaultCompiler = require('@vue/component-compiler').createDefaultCompiler

/**
 * Rewrite all style imports from scss to css
 * @param {String} code the source code
 * @return {String} The new source code
 **/
const rewriteStyleImport = (code) => code.replace(/import '(.*)\.scss'/g, "import '$1.css'")

const trimPadding = (code) => code.replace(/\/\/\n/g, '')

/**
 * Import Vue files and parse them to plain js
 * Replaces all scss imports to css imports
 * @param {String} filename name of the imported file
 * @param {String} sourcePath path to the import source
 * @param {String} newFilename new name of the parsed file
 * @param {String} destinationPath path where to save the parsed file
 **/
async function importVueFile(filename, sourcePath, newFilename, destinationPath) {
  const source = fs.readFileSync(path.join(sourcePath, filename), 'utf-8')

  function transformRequireToImport(code) {
    const imports = {}
    let strImports = ''

    code = code.replace(/require\(("(?:[^"\\]|\\.)+"|'(?:[^'\\]|\\.)+')\)/g, (_, name) => {
      if (!(name in imports)) {
        imports[name] = `__$_require_${name
          .replace(/[^a-z0-9]/g, '_')
          .replace(/_{2,}/g, '_')
          .replace(/^_|_$/g, '')}__`
        strImports += 'import ' + imports[name] + ' from ' + name + '\n'
      }

      return imports[name]
    })

    return strImports + code
  }

  try {
    const descriptor = parse({
      filename,
      source,
      compiler: templateCompiler,
      needMap: false
    })

    const scopeId = 'data-v-' + hash(filename + source)

    const input = {
      scopeId,
      styles: [],
      customBlocks: []
    }

    if (descriptor.styles.length !== 0) {
      throw new Error(`SFC Styles are currently not supported (${path.join(sourcePath, filename)})`)
    }

    const compiler = createDefaultCompiler({})

    if (descriptor.template) {
      input.template = compiler.compileTemplate(filename, descriptor.template)

      input.template.code = transformRequireToImport(input.template.code)

      if (input.template.errors && input.template.errors.length) {
        input.template.errors.map((error) => this.error(error))
      }

      if (input.template.tips && input.template.tips.length) {
        input.template.tips.map((message) => this.warn({ message }))
      }
    }

    input.script = descriptor.script ? { code: descriptor.script.content } : { code: '' }

    // remove spaces from code string
    input.script.code = input.script.code.replace(/^\s+/gm, '')

    // rewrite all style import file extensions
    input.script.code = rewriteStyleImport(input.script.code)

    const result = assemble(compiler, filename, input, {})

    fs.mkdir(destinationPath, { recursive: true }, (err) => {
      if (err) throw err
      fs.writeFile(path.join(destinationPath, newFilename), trimPadding(result.code), (err) => {
        if (err) throw err
      })
    })
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
  }
}

/**
 * Import JS files and transfrom it
 * Replaces all scss imports to css imports
 * @param {String} filename name of the imported file
 * @param {String} sourcePath path to the import source
 * @param {String} destinationPath path where to save the parsed file
 **/
async function importJsFile(filename, sourcePath, destinationPath) {
  try {
    let source = fs.readFileSync(path.join(sourcePath, filename), 'utf-8')

    // rewrite all style import file extensions
    source = rewriteStyleImport(source)

    fs.mkdir(destinationPath, { recursive: true }, (err) => {
      if (err) throw err
      fs.writeFile(path.join(destinationPath, filename), source, (err) => {
        if (err) throw err
      })
    })
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
  }
}

/**
 * Import Json files copy them to the esm folder
 * Replaces all scss imports to css imports
 * @param {String} filename name of the imported file
 * @param {String} sourcePath path to the import source
 * @param {String} destinationPath path where to save the parsed file
 **/
async function importJsonFile(filename, sourcePath, destinationPath) {
  try {
    const source = fs.readFileSync(path.join(sourcePath, filename), 'utf-8')

    fs.mkdir(destinationPath, { recursive: true }, (err) => {
      if (err) throw err
      fs.writeFile(path.join(destinationPath, filename), source, (err) => {
        if (err) throw err
      })
    })
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
  }
}

/**
 * Find all js and vue files and execute the import function
 **/
function importFiles() {
  // import vue files
  glob('src/**/*.vue', { ignore: 'src/**/*+(.spec|.stories|.ignore).vue' }, (err, files) => {
    if (err) throw err

    files.forEach((source) => {
      const filename = path.basename(source)
      const sourcePath = path.dirname(source)
      const newFilename = filename.replace(/.vue$/, '.js')
      const destinationArray = path.dirname(source).split(path.sep)
      destinationArray.splice(0, 1, 'tmp')
      importVueFile(filename, sourcePath, newFilename, path.join(...destinationArray))
    })
  })

  // import js files
  glob('src/**/*.js', { ignore: 'src/**/*+(.spec|.stories|.ignore).js' }, (err, files) => {
    if (err) throw err

    files.forEach((source) => {
      const filename = path.basename(source)
      const sourcePath = path.dirname(source)
      const destinationArray = path.dirname(source).split(path.sep)
      destinationArray.splice(0, 1, 'tmp')
      if (filename.match(/(.stories|.spec|.ignore)/)) return
      importJsFile(filename, sourcePath, path.join(...destinationArray))
    })
  })

  // import json files
  glob('src/**/*.json', { ignore: 'src/**/*+(.spec|.stories|.ignore).json' }, (err, files) => {
    if (err) throw err

    files.forEach((source) => {
      const filename = path.basename(source)
      const sourcePath = path.dirname(source)
      const destinationArray = path.dirname(source).split(path.sep)
      destinationArray.splice(0, 1, 'esm')
      if (filename.match(/(.stories|.spec|.ignore)/)) return
      importJsonFile(filename, sourcePath, path.join(...destinationArray))
    })
  })
}

importFiles()
