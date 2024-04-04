// cuando hay llaves es porque exporta multiples funciones
const { src, dest, watch, series, parallel} = require('gulp');

// DEPENDENCIAS ------------------------------------------
// CSS y SASS
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano');

// Imagenes
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

function css(done){
    // compilar sass
    // pasos: 1 - identificar archivo, 2 - compilarla. 3 - guardar el .css
    
    //identifico el archivo
    src('src/scss/app.scss')
        // con pipe compilo el archivo
        .pipe(sourcemaps.init())
        .pipe(sass())  
        .pipe(postcss([autoprefixer(), cssnano()]))
        //aqui guardo el .css
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/css'))
    
    done()
}

function imagenes(){
    return src('src/img/**/*')
    //muevo todas las imagenes a la nueva direccion
    //optimizo las imagenes
    .pipe(imagemin({optimizationLevel: 3}))
    .pipe(dest('build/img'))
}

function versionWebp(){
    const opciones = {
        quiality: 50
    }
    return src('src/img/**/*.{png,jpg}')
    .pipe(avif(opciones))
    .pipe(webp())
    .pipe(dest('build/img'))
}

function versionAvif(){
    const opciones = {
        quiality: 50
    }
    return src('src/img/**/*.{png,jpg}')
    .pipe(avif(opciones))
    .pipe(dest('build/img'))
}

function dev(){
    // toma dos valores: el archivo que quiero que le ponga atencion, y que hacer cuando se hace un cambio en el archivo
    watch('src/scss/**/*.scss', css);
    //si se agregan nuevas imagenes se van a mandar a la direccion correspondiente
    watch('src/img/**/*', imagenes);
}

exports.css = css;
exports.imagenes = imagenes;
exports.dev = dev;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.default = series(css, dev);

//series = inicia una tarea, finaliza e inicia la otra. Esta es la mejor opcion (igual es depende el proyecto).
//parallel = todas inician al mismo tiempo.