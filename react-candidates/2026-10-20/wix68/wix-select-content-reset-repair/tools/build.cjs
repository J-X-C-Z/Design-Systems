const path=require('node:path'),fs=require('node:fs');
const root=path.resolve(__dirname,'..');
if(!process.env.LOCAL_DEPENDENCIES)throw Error('Set LOCAL_DEPENDENCIES to existing local node_modules; no installation is performed.');
const esbuild=require(path.join(process.env.LOCAL_DEPENDENCIES,'esbuild'));
(async()=>{for(const [format,name]of [['esm','index.js'],['cjs','index.cjs']]){await esbuild.build({absWorkingDir:root,entryPoints:[path.join(root,'src/index.tsx')],outfile:path.join(root,'dist',name),bundle:true,format,platform:'neutral',target:'es2020',external:['react','react-dom'],logLevel:'error',metafile:true}).then(r=>fs.writeFileSync(path.join(root,'qa',format+'-metafile.json'),JSON.stringify(r.metafile,null,2)));}console.log('Two local component formats built, React and React DOM external.');})().catch(e=>{console.error(e);process.exitCode=1});
