// import resolve from '@rollup/plugin-node-resolve';
// import pluginReplace from '@rollup/plugin-replace';
// import VuePlugin from 'rollup-plugin-vue';
// import commonjs from 'rollup-plugin-commonjs' ;

export default [{
    input: 'src/AStar.js',
    output: [{
        file: 'dist/astar.common.js',
        exports: 'named',
        format: 'cjs',
    }, {
        file: 'dist/astar.esm.js',
        format: 'esm',
    }],
    context: 'this',
}];
