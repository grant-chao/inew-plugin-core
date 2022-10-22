import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import alias from '@rollup/plugin-alias';
import * as path from "path";
import postcss from 'rollup-plugin-postcss';
import commonjs from 'rollup-plugin-commonjs';
import pkg from './package.json';

const root = path.resolve(__dirname);

export default {
    input: './src/inew/index.js',
    output: {
        file: './lib/index.js',
        format: 'umd',
        name: 'INewPluginApp',
        globals: {
            'lodash': '_',
            'react': 'React',
            'dayjs': 'dayjs',
            '@arco-design/web-react': 'webReact',
            'chinese-lunar': 'chineseLunar',
            '@feizheng/react-digital-numeric': 'ReactDigitalNumeric',
            'sortablejs': 'Sortable',
            'react-draggable': 'Draggable',
            'react-resizable': 'reactResizable'
        },
    },
    plugins: [
        babel(),
        alias({
            entries: [
                { find: '@', replacement: path.resolve(root, 'src') },
                { find: 'inew-plugin-core', replacement: path.resolve(root, 'src/inew') }
            ]
        }),
        resolve(),
        postcss({
            extract: false,
            modules: true,
            use: ['sass'],
        }),
        commonjs()
    ],
    external: [
        ...Object.keys(pkg.dependencies),
        ...Object.keys(pkg.devDependencies)
    ],
}
