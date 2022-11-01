import path from 'path'
import { filter, first, last, map, Observable, take } from 'rxjs'
import fs from 'fs'

const filePaths: string[] = [
  path.join(__dirname, 'files', 'app_1.txt'),
  path.join(__dirname, 'files', 'app_2.txt'),
  path.join(__dirname, 'files', 'app_3.txt'),
  path.join(__dirname, 'files', 'app_4.txt'),
  path.join(__dirname, 'files', 'estilo_1.css'),
  path.join(__dirname, 'files', 'estilo_2.css'),
  path.join(__dirname, 'files', 'estilo_3.css'),
  path.join(__dirname, 'files', 'estilo_4.css'),
  path.join(__dirname, 'files', 'estrutura_1.html'),
  path.join(__dirname, 'files', 'estrutura_2.html'),
  path.join(__dirname, 'files', 'estrutura_3.html'),
  path.join(__dirname, 'files', 'estrutura_4.html')
]

const isCSS = /^((.|#|:){0,1}(\w+-{0,1})+\s*{(\s*((--){0,1}\w+-{0,1})+:\s*(\w+\s*)+;\s*)+\s*}\s*)/i
const isHTML = /^<!DOCTYPE html>/i

//Observables enviam dados de forma contínua!
/* A classe Observable recebe como parâmetro uma função reponsável pela
geração dos dados que enviará. */
//subscriber é uma referência do dependente da informação
function lerArquivos(arquivos: string[]) {
  const leitor = new Observable<string>((subscriber) => {
    arquivos.forEach((arquivo) =>{      
      try {
        const conteudo = fs.readFileSync(arquivo, {encoding: 'utf-8'})
        subscriber.next(conteudo)
      } catch (error) {
        subscriber.error(`Não foi possível ler o arquivo que está no caminho ${arquivo}`)
      }
    })
    subscriber.complete()
  })
  return leitor
}
let obs = lerArquivos(filePaths)
obs.pipe(map((texto)=>{return texto.split(' ')[0]}), map((palavra)=>{return palavra.length})).subscribe((conteudoLido)=>{
  console.log('----------INICIO AQUIVO----------')
  console.log(conteudoLido)
  console.log('---------FIM DO ARQUIVO---------\n\n\n')
},)

obs.pipe(filter((txt)=>{return isHTML.test(txt)})).subscribe({
  next: (conteudoLido) => console.log('----------INICIO ARQUIVO HTML----------\n'+ conteudoLido +'\n----------FIM DO ARQUIVO HTML---------\n\n\n'),
  error: (e) => console.error(e),
  complete: () => console.log('Todos arquivos lidos com sucesso!') 
})

obs.pipe(filter((txt)=>{return isCSS.test(txt)})).subscribe({
  next: (conteudoLido) => console.log('----------INICIO ARQUIVO CSS----------\n'+ conteudoLido +'\n----------FIM DO ARQUIVO CSS---------\n\n\n'),
  error: (e) => console.error(e),
  complete: () => console.log('Todos arquivos lidos com sucesso!') 
})

obs.pipe(filter((txt)=>{return (!isCSS.test(txt) && !isHTML.test(txt))})).subscribe({
  next: (conteudoLido) => console.log('----------INICIO ARQUIVO TXT----------\n'+ conteudoLido +'\n----------FIM DO ARQUIVO TXT---------\n\n\n'),
  error: (e) => console.error(e),
  complete: () => console.log('Todos arquivos lidos com sucesso!') 
})

obs.pipe(take(4)).subscribe({
  next: (conteudoLido) => console.log('----------TAKE----------\n'+ conteudoLido +'\n----------TAKE---------\n\n\n'),
  error: (e) => console.error(e),
  complete: () => console.log('Todos arquivos lidos com sucesso!') 
})

obs.subscribe({
  next: (conteudoLido) => console.log(`Este arquivo possui ${conteudoLido.length} caracteres`),
  error: (e) => console.error(e),
  complete: () => console.log('Todos arquivos lidos com sucesso!') 
})

obs.pipe(first()).subscribe({
  next: (conteudoLido) => console.log('----------FIRST----------\n'+ conteudoLido +'\n----------FIRST---------\n\n\n'),
  error: (e) => console.error(e),
  complete: () => console.log('Todos arquivos lidos com sucesso!') 
})

obs.pipe(last()).subscribe({
  next: (conteudoLido) => console.log('----------LAST----------\n'+ conteudoLido +'\n----------LAST---------\n\n\n'),
  error: (e) => console.error(e),
  complete: () => console.log('Todos arquivos lidos com sucesso!') 
})

obs.pipe(first((txt)=>{return isHTML.test(txt)})).subscribe({
  next: (conteudoLido) => console.log('----------FIRST HTML----------\n'+ conteudoLido +'\n----------FIRST HTML---------\n\n\n'),
  error: (e) => console.error(e),
  complete: () => console.log('Todos arquivos lidos com sucesso!')
})

/**
       * --> Envio de Dados do Observable <--
       * 
       * 3 ESTÁGIOS
       *   -> Sucesso: O Observable conseguiu realizar seu trabalho sem nenhum problema
       *               e enviou os dados com sucesso
       *   
       *   -> Erro: O Observable teve algum problema durante a sua execução e não conseguiu
       *            realizar sua tarefa de maneira satisfatória e não conseguiu enviar os dados
       *            Quando um Observable passa pelo estágio de erro, sua execução para automaticamente
       * 
       *   -> Completo: O Observable realizou TODAS as suas tarefas com sucesso e não possui
       *                mais nenhum dado para poder enviar.
       */