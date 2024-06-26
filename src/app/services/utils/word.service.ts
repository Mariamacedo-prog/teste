import { Injectable } from '@angular/core';
import { Document, Packer, Paragraph, TextRun , Header, ImageRun} from 'docx';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class WordService {
  constructor() { }
  prefeituraNome = "Prefeitura municipal de Mairinque";
  
  generateWord(doc: Document, nome: any): void {
    Packer.toBlob(doc).then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      if(nome){
        a.download = `${nome}.docx`;
      }else{
        a.download = 'contrato_REURB.docx';
      }

      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    });
  }
  getDocumentBlob(doc: Document): Promise<string> {
    return new Promise((resolve, reject) => {
      Packer.toBlob(doc).then(blob => {
        const url = URL.createObjectURL(blob);
        resolve(url);
      }).catch(error => {
        reject(error);
      });
    });
  }
  obterData(data = new Date()) {
    const meses = [
        "Janeiro", "Fevereiro", "Março", "Abril",
        "Maio", "Junho", "Julho", "Agosto",
        "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = meses[data.getMonth()];
    const ano = data.getFullYear();

    return `${dia} de ${mes} de ${ano}`;
  }

  gerarParagrafo(data: any, alignment: 
    "left" | "start" | "center" | "end" | "both" | "mediumKashida" | 
  "distribute" | "numTab" | "highKashida" | "lowKashida" | "thaiDistribute" | "right" | undefined = "left"){
    let textArrays:any = []


      for(let item of data){
        textArrays.push(new TextRun(item));
      }
      return new Paragraph({
        children: textArrays
        ,
        spacing: {
            line: 400
        },
        alignment: alignment
      })
   
  }

  transform(numero: number): string {
     const numerosPorExtenso = [
        'zero', 'uma', 'duas', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove',
        'dez', 'onze', 'doze', 'treze', 'catorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove',
        'vinte', 'vinte e um', 'vinte e dois', 'vinte e três', 'vinte e quatro', 'vinte e cinco',
        'vinte e seis', 'vinte e sete', 'vinte e oito', 'vinte e nove', 'trinta'
    ];

    if (numero < 1 || numero > 30) {
        return '';
    }

    return numerosPorExtenso[numero];
  }

  gerarEnderecoPorta(imovelDoContratante: any): string{
    let item = imovelDoContratante.enderecoPorta;
    if(item){
      return `${imovelDoContratante?.enderecoPorta?.rua}, n ${imovelDoContratante?.enderecoPorta?.numero}${imovelDoContratante?.enderecoPorta?.complemento ? ' '+ imovelDoContratante?.enderecoPorta?.complemento : ''}, ${imovelDoContratante?.enderecoPorta?.bairro}, ${imovelDoContratante?.enderecoPorta?.cidadeUf} `;
    }else{
      return '';
    }
  }

  formatarData(dataString: any, dia: boolean = false) {
    if(dia == false){
      const data = new Date(dataString);
      const dia = data.getUTCDate().toString().padStart(2, '0');
      const mes = (data.getUTCMonth() + 1).toString().padStart(2, '0');
      const ano = data.getUTCFullYear().toString();
      return `${dia}/${mes}/${ano}`;
    }else{
      const data = new Date(dataString);
      const dia = data.getUTCDate().toString().padStart(2, '0');
      return dia;
    }
  }

  verificarDado(dataString: any): string{
    if(dataString != undefined && dataString != null){
      return dataString;
    }else{
      return '';
    }
  }

  pluralPalavra(quantidade: number, singular: string, plural: string): string{
    if(quantidade > 1){
      return plural;
    }else{
      return singular;
    }
  }

 async assinatura(base64: string){
  const response = await fetch(base64);
  const arrayBuffer = await response.arrayBuffer();

  return new ImageRun({
    data: arrayBuffer,
    transformation: {
      width: 300,
      height: 120,
    }
  });
  }

async generateWordContratoFile(formControls: FormGroup,  imovelDoContratante: any, parcelamentoInfo: any) {
    console.log(formControls,  imovelDoContratante, parcelamentoInfo);
    const image = new ImageRun({
        data: await fetch('../../../../assets/logoLM.psd.png').then(response => response.arrayBuffer()),
        transformation: {
            width: 70,
            height: 70,
        }
    });


    const header = new Header({
      children: [new Paragraph({
        children: [image],
        alignment: "right"
      })]
    });

    const space = new Paragraph({
      children: [
        new TextRun(""),
    ]})

    const doc = new Document({
    sections: [
        {
            properties: {},
            headers: {default: header},
            children: [
              this.gerarParagrafo(
               [ { text:"CONTRATO DE PRESTAÇÃO DE SERVIÇOS PARA INDIVIDUALIZAÇÃO DE UNIDADES", 
                  bold:true, 
                  size:31, 
                  font: "Arial"
                }], "center"),
              space,
              space,  space,
              this.gerarParagrafo(
                [{ text:"Pelo presente instrumento particular, as partes abaixo qualificadas", 
                  bold:true, 
                  size:25, 
                  font: "Arial"
                }]),
              space,  space,
              this.gerarParagrafo(
                [ 
                 { text:'Contratante: ', 
                   bold:true, 
                   size:25, 
                   font: "Arial",
                 },
                 { 
                   text:`${formControls?.get('contratante')?.get('nome')?.value}, ${formControls?.get('contratante')?.get('nacionalidade')?.value}, ${formControls?.get('contratante')?.get('estadoCivil')?.value}, ${formControls?.get('contratante')?.get('profissao')?.value}, inscrito no ${formControls?.get('contratante')?.get('cpf')?.value.length <= 11 ? 'CPF ': 'CNPJ '} sob o n° ${formControls?.get('contratante')?.get('cpf')?.value} e no RG sob o n° ${formControls?.get('contratante')?.get('rg')?.value}, residente e domiciliado na rua ` + this.gerarEnderecoPorta(imovelDoContratante),
                   size:25, 
                   font: "Arial",
                   outlineLevel: 2,
                 },
                 { text:'CONTRATANTE. ', 
                 bold:true, 
                 size:25, 
                 font: "Arial"
               },
               ]),
              space,  space,
              this.gerarParagrafo([ 
                { text:'Contratada: ', 
                  bold:true, 
                  size:25, 
                  font: "Arial"
                },
                { 
                  text:`${formControls?.get('empresa')?.get('nome')?.value}, pessoa jurídica de direito privado, inscrita no CNPJ sob o n° ${formControls?.get('empresa')?.get('cnpj')?.value}, com sede na ${formControls?.get('empresa')?.get('endereco')?.get('rua')?.value}, n ${formControls?.get('empresa')?.get('endereco')?.get('numero')?.value} ${formControls?.get('empresa')?.get('endereco')?.get('complemento')?.value}, ${formControls?.get('empresa')?.get('endereco')?.get('bairro')?.value}, ${formControls?.get('empresa')?.get('endereco')?.get('cidadeUf')?.value}, representada nesse ato por seu sócio administrador Claudemy Pereira da Silva, brasileiro, divorciado, empresário, residente e domiciliado na cidade de São Paulo – SP, cadastro no CPF/MF sob o nº040.237.058-96, e no RG. Sob o nº14.862.742-0, doravante denominada `,
                  size:25, 
                  font: "Arial",
                  outlineLevel: 2,
                },
                { text:'CONTRATADA. ', 
                bold:true, 
                size:25, 
                font: "Arial"
              },
              ]),
              space,  space,
              this.gerarParagrafo(
                [{ text:"Considerando: ", 
                  bold:true, 
                  size:25, 
                  font: "Arial"
              }]),
              space,  space,
              this.gerarParagrafo(
                [{ text:"        • A Lei n° 13.465/2017, que dispõe sobre a regularização fundiária urbana e rural;", 
                  size:25, 
                  font: "Arial"
                }]),
              this.gerarParagrafo(
                [{ text:"        • O interesse do ", 
                  size:25, 
                  font: "Arial"
                },
                { text:"CONTRATANTE ", 
                  bold:true, 
                  size:25, 
                  font: "Arial"
                },
              { text:"em individualizar a(s) unidade(s) de sua propriedade, situada(s) no " + this.gerarEnderecoPorta(imovelDoContratante), 
                  size:25, 
                  font: "Arial"
                }
              ]),
              this.gerarParagrafo(
                [{ text:"        • A experiência e expertise da CONTRATADA na prestação de serviços de individualização de unidades.", 
                  size:25, 
                  font: "Arial"
              }]),
              space,  space,
              this.gerarParagrafo(
              [{ text:"Celebram o presente Contrato de Prestação de Serviços para Individualização de Unidades, que se regerá pelas cláusulas e condições seguintes:", 
                bold:true, 
                size:25, 
                font: "Arial"
              }]),
              space,  space,
              this.gerarParagrafo(
              [{ text:"Cláusula 1ª - Do Objeto", 
                bold:true, 
                size:25, 
                font: "Arial"
              }]),
              space, 
              this.gerarParagrafo([ 
                { text:'A ', 
                  size:25, 
                  font: "Arial"
                },
                { text:'CONTRATADA ', 
                  bold:true, 
                  size:25, 
                  font: "Arial"
                },
                { text:"se obriga a prestar ao ",
                  size:25, 
                  font: "Arial",
                },
                { text:'CONTRATANTE ', 
                  bold:true, 
                  size:25, 
                  font: "Arial"
                },
                { text:"os serviços de individualização da(s) unidade(s) de sua propriedade, situada(s) no " + this.gerarEnderecoPorta(imovelDoContratante) + ";"+" em conformidade com a Lei n° 13.465/2017 (REURB), com a implemento dos dados técnicos suficientes e indispensáveis para a emissão da CRF – Certidão de Regularização Fundiária por parte da " + this.prefeituraNome + ", para a aprovação e consequente encaminhamento ao " + formControls?.get('cartorio')?.get('nome')?.value, 
                  size:25, 
                  font: "Arial"
                },
              ]),
              space,  space,
              this.gerarParagrafo(
              [{ text:"Cláusula 2ª - Dos Serviços", 
                bold:true, 
                size:25, 
                font: "Arial"
              }]),
              space,  space,
              this.gerarParagrafo(
                [{ text:"Os serviços a serem prestados pela ", 
                  size:25, 
                  font: "Arial"
                },
                { text:"CONTRATADA ", 
                  bold:true, 
                  size:25, 
                  font: "Arial"
                },
                { text:"compreendem: ", 
                  size:25, 
                  font: "Arial"
                }
              ]),
              space,  space,
              this.gerarParagrafo(
                [{ text:`        • Organizar e apresentar todas as informações necessárias para a ${this.prefeituraNome} emitir a Certidão de Regularização Fundiária (CRF) da unidade autônoma do ${imovelDoContratante.enderecoPorta?.nucleoInformal};`, 
                  size:25, 
                  font: "Arial"
                }]),
              this.gerarParagrafo(
                [{ text:`        • Encaminhar os trabalhos técnicos realizados à ${this.prefeituraNome}, através de protocolo conjunto do ${imovelDoContratante.enderecoPorta?.nucleoInformal};`, 
                  size:25, 
                  font: "Arial"
                }
              ]),
              this.gerarParagrafo(
                [{ text:`        • Execução do desmembramento das unidades individualizada do ${imovelDoContratante.enderecoPorta?.nucleoInformal};`, 
                  size:25, 
                  font: "Arial"
              }]),
              this.gerarParagrafo(
                [{ text:"        • Acompanhamento e assistência técnica durante todo o processo de individualização.", 
                  size:25, 
                  font: "Arial"
              }]),
              this.gerarParagrafo(
                [{ text:"        • Entregar das plantas e memoriais, que servirão para locação das divisas a qualquer tempo.", 
                  size:25, 
                  font: "Arial"
              }]),
              this.gerarParagrafo(
                [{ text:`        • Encaminhar a ${this.prefeituraNome} todos os documentos pessoais e da propriedade levantados e recebidos do CONTRATANTE para fazer parte de seu arquivo.`, 
                  size:25, 
                  font: "Arial"
              }]),
              space, space,
              this.gerarParagrafo(
                [{ text:"Cláusula 3ª - Da responsabilidade da CONTRATADA:", 
                  bold:true, 
                  size:25, 
                  font: "Arial"
                }]),
              space,  space,
              this.gerarParagrafo(
                [{ text:`        • A CONTRATADA se compromete a cumprir todas as exigências da ${this.prefeituraNome}, no sentido de terminar a REURB do ${imovelDoContratante.enderecoPorta?.nucleoInformal};`, 
                  size:25, 
                  font: "Arial"
                }]
              ),
              this.gerarParagrafo(
                [{ text:`        • A CONTRATADA se compromete a usar os dados do CONTRATANTE de forma responsável, única e exclusivamente para o propósito desse contrato;`, 
                  size:25, 
                  font: "Arial"
                }]
              ),
              this.gerarParagrafo(
                [{ text:`        •  A CONTRATADA encaminhará ao CONTRATANTE os instrumentos técnicos resultante dos trabalhos executados em sua propriedade;`, 
                  size:25, 
                  font: "Arial"
                }]
              ),
              this.gerarParagrafo(
                [{ text:`        •  A CONTRATADA realizara os levantamentos necessários a individualização do terreno do CONTRATANTE.`, 
                  size:25, 
                  font: "Arial"
                }]
              ),
              space, space,
              this.gerarParagrafo(
                [{ text:"Cláusula 4ª - Da responsabilidade da CONTRATANTE:", 
                  bold:true, 
                  size:25, 
                  font: "Arial"
                }]),
              space,  space,
              this.gerarParagrafo(
                [{ text:`        • A CONTRATANTE se compromete a apresentar os documentos de aquisição do terreno a ser regularizado, não tenha, apresentar declaração de que é posseiro e comprovar tempo de posse;`, 
                  size:25, 
                  font: "Arial"
                }]
              ),
              this.gerarParagrafo(
                [{ text:`        • A CONTRATANTE se responsabiliza pela veracidade dos documentos apresentados para a formação do projeto e processo de regularização do imóvel;`, 
                  size:25, 
                  font: "Arial"
                }]
              ),
              this.gerarParagrafo(
                [{ text:`        • A CONTRATANTE se obriga a apresentar seus documentos pessoais, no qual também servirão de parâmetros para a formalização desse contrato, bem como, para a emissão da CRF por parte da ${this.prefeituraNome} e consequentemente para a abertura de Matrícula junto ao ${formControls?.get('cartorio')?.get('nome')?.value};`, 
                  size:25, 
                  font: "Arial"
                }]
              ),
              this.gerarParagrafo(
                [{ text:`        • A CONTRATANTE se obriga a qualquer tempo apresentar novos documentos, quando solicitado pelo CONTRATADO;`, 
                  size:25, 
                  font: "Arial"
                }]
              ),
              this.gerarParagrafo(
                [{ text:`        • A CONTRATANTE se obriga a pagar os valores ajustados nesse contrato.`, 
                  size:25, 
                  font: "Arial"
                }]
              ),


              space, space,
              this.gerarParagrafo(
              [{ text:"Cláusula 5ª - Do Prazo", 
                bold:true, 
                size:25, 
                font: "Arial"
              }]),
              space, space,
              this.gerarParagrafo(
                [{ text:"O prazo para a execução dos serviços será de ", 
                  size:25, 
                  font: "Arial"
                },
                { text:"120 ", 
                  bold:true, 
                  size:25, 
                  font: "Arial"
                },
                { text:`dias, contados a partir da assinatura deste contrato, para a protocolização junto a ${this.prefeituraNome}`, 
                  size:25, 
                  font: "Arial"
                }
              ]),

              space, space,
              this.gerarParagrafo(
              [{ text:"Cláusula 6ª - Do Valor", 
                bold:true, 
                size:25, 
                font: "Arial"
              }]),
              space, 
              this.gerarParagrafo(
                [{ text:"O valor total dos serviços a serem prestados pela ", 
                  size:25, 
                  font: "Arial"
                },
                { text:"CONTRATADA ", 
                  bold:true, 
                  size:25, 
                  font: "Arial"
                },
                { text:"é de ", 
                  size:25, 
                  font: "Arial"
                },
                { text: `${parcelamentoInfo?.valorAvista?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} (reais)`, 
                  bold:true, 
                  size:25, 
                  font: "Arial"
                }
              ]),
              space,
             



            
              space, space,space,
              this.gerarParagrafo(
              [{ text:"Cláusula 7ª - Da Forma de Pagamento", 
                bold:true, 
                size:25, 
                font: "Arial"
              }]),
              this.gerarParagrafo(
                [{ text: parcelamentoInfo?.parcelas?.quantidade > 0 ? `        • ${parcelamentoInfo?.entrada?.porcentagem ? (parcelamentoInfo?.entrada?.porcentagem * 100) + '%' : '10% (dez por cento)'} de entrada, `: "",
                  bold:true,
                  size:25, 
                  font: "Arial"
                },
                { text:parcelamentoInfo?.parcelas?.quantidade > 0 ?"divididos em ": "",
                  size:25, 
                  font: "Arial"
                },
                { text:parcelamentoInfo?.parcelas?.quantidade > 0 ?`${parcelamentoInfo?.entrada?.quantidade} (${this.transform(parcelamentoInfo?.entrada?.quantidade)}) `: "",
                  bold:true,
                  size:25, 
                  font: "Arial"
                },
                { text:parcelamentoInfo?.parcelas?.quantidade > 0 ?`${this.pluralPalavra(parcelamentoInfo?.entrada?.quantidade, 'vez', 'vezes')}, com vencimento ${this.pluralPalavra(parcelamentoInfo?.entrada?.quantidade, 'da', 'das')} ${this.pluralPalavra(parcelamentoInfo?.entrada?.quantidade, 'parcela', 'parcelas')} ${this.pluralPalavra(parcelamentoInfo?.entrada?.quantidade, 'no', 'nos')} ${this.pluralPalavra(parcelamentoInfo?.entrada?.quantidade, 'dia', 'dias')} `: "",
                  size:25, 
                  font: "Arial"
                },
                { text: parcelamentoInfo?.parcelas?.quantidade > 0 ?`${parcelamentoInfo?.entrada?.quantidade == 1 ?  this.formatarData(parcelamentoInfo?.entrada?.dataPrimeiroPagamento): `${this.formatarData(parcelamentoInfo?.entrada?.dataPrimeiroPagamento)}, ${this.formatarData(parcelamentoInfo?.entrada?.dataUltimoPagamento)}` } `: "",
                  bold:true,
                  size:25, 
                  font: "Arial"
                }
              ]),
              this.gerarParagrafo(
                [{ text: parcelamentoInfo?.parcelas?.quantidade > 0 ? `        • O restante, equivalente a ${parcelamentoInfo?.parcelas?.porcentagem ? (parcelamentoInfo?.parcelas?.porcentagem * 100 + '%'): '90%  (noventa por cento)'}, ` : "",
                    bold:true,
                    size:25, 
                    font: "Arial"
                  },
                  { text:parcelamentoInfo?.parcelas?.quantidade > 0 ? "poderá será dividido em até " : "", 
                    size:25, 
                    font: "Arial"
                  },
                  { text:parcelamentoInfo?.parcelas?.quantidade > 0 ? `${parcelamentoInfo?.parcelas?.quantidade} `: "", 
                    bold:true,
                    size:25, 
                    font: "Arial"
                  },
                  { text:parcelamentoInfo?.parcelas?.quantidade > 0 ? "parcelas mensais e iguais corrigidas pelo ": "",
                    size:25, 
                    font: "Arial"
                  },
                  { text:parcelamentoInfo?.parcelas?.quantidade > 0 ? `IGP-M, `: "", 
                    bold:true,
                    size:25, 
                    font: "Arial"
                  },
                  { text:parcelamentoInfo?.parcelas?.quantidade > 0 ?`com vencimento da primeira parcela no dia ${this.formatarData(parcelamentoInfo?.parcelas?.dataPrimeiroPagamento)} `: "",
                    bold:true,
                    size:25, 
                    font: "Arial"
                  },
                  { text:parcelamentoInfo?.parcelas?.quantidade > 0 ? "assim sucessivamente a cada mês. ": "",
                    size:25, 
                    font: "Arial"
                  }
              ]),
             
              space,
              this.gerarParagrafo(
                [{ text: parcelamentoInfo?.parcelas?.quantidade > 0 
                  ? `` 
                  : `        • Pago em uma única vez, em moeda corrente, na assinatura do presente contrato no valor de ${parcelamentoInfo?.valorAvista?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} (reais)`,
                  bold:true,
                  size:25, 
                  font: "Arial"
              }]),

              this.gerarParagrafo(
                [
                  { text:parcelamentoInfo?.parcelas?.quantidade == 0 
                    ? "        • Quantidade proposta pelo CONTRATANTE: À VISTA " 
                    : `        • Quantidade de parcelas proposta pelo CONTRATANTE: ${parcelamentoInfo?.parcelas?.quantidade} de ${parcelamentoInfo?.parcelas?.valor?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} + IGP-M, sendo a entrada em ${parcelamentoInfo?.entrada?.quantidade} de ${parcelamentoInfo?.entrada?.valor?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}  `,
                  bold:true,
                  size:25, 
                  font: "Arial"
                  }
                ]
              ),
              space,  space,
              this.gerarParagrafo(
              [{ text:"O pagamento das parcelas poderá ser feito através de boleto bancário, cartão de crédito, débito ou PIX, o qual será enviado com antecedência por MSN, WhatsApp, e-mail ou outra forma de comunicação.",  
                size:25, 
                font: "Arial"
              }]),
              space,  space,
              this.gerarParagrafo(
              [{ text:"Cláusula 8ª - Dos Reajustes", 
                bold:true, 
                size:25, 
                font: "Arial"
              }]),
              space,  space,
              this.gerarParagrafo(
              [{ text:"Os valores das parcelas mensais serão reajustados mensalmente, pela variação do ",  
                size:25, 
                font: "Arial"
              },{
                text:"IGP-M ",  
                size:25, 
                font: "Arial",
                bold:true
              }]),
              space,  space,
              this.gerarParagrafo(
              [{ text:"Cláusula 9ª - Da Inadimplência",  
                bold:true, 
                size:25, 
                font: "Arial"
              }]),
              space,  space,
              this.gerarParagrafo(
              [{ text:"Em caso de inadimplência dos pagamentos pactuados a ",  
                size:25, 
                font: "Arial"
              },{
                text:"CONTRATANTE, ",  
                size:25, 
                font: "Arial",
                bold:true
              },
              {
                text:"pagará a ",  
                size:25, 
                font: "Arial"
              },
              {
                text:"CONTRATADA ",  
                size:25, 
                font: "Arial",
                bold:true
              },
              {
                text:"os juros de mora de ",  
                size:25, 
                font: "Arial"
              },
              {
                text:"1% (um por cento) ",  
                size:25, 
                font: "Arial",
                bold:true
              }, 
              {
                text:"ao mês, se e somente se os serviços contratados ainda não estiverem terminados poderá a ",  
                size:25, 
                font: "Arial"
              },
              {
                text:"CONTRATADA ",  
                size:25, 
                font: "Arial",
                bold:true
              },
              {
                text:"suspender a prestação dos serviços e consequentemente rescindir o contrato, caso a prestação de serviço esteja encerrada ou em andamento que impossibilite a paralização deste contrato opera-se a Cláusula de Pacto Adjeto, encontrando fundamento legal no Código Civil Brasileiro, como base legal principal, em seu Art. 395, nos Incisos I a IV, que conceitua o inadimplemento e suas consequências, como a mora do devedor e a possibilidade de exigir a resolução do contrato e o pagamento da dívida em atraso. ",  
                size:25, 
                font: "Arial"
              },
              ]),
              space,  space,
              this.gerarParagrafo(
              [{ text:"Cláusula 10ª - Da Rescisão",  
                bold:true, 
                size:25, 
                font: "Arial"
              }]),
              space,  space,
              this.gerarParagrafo(
              [
                { text:"O presente contrato poderá ser rescindido por qualquer das partes, mediante comunicação por escrito com antecedência mínima de ",  
                  size:25, 
                  font: "Arial"
                },
                { text:"30 (trinta) ",  
                  bold:true, 
                  size:25, 
                  font: "Arial"
                },
                { text:"dias, desde que qualquer das partes deixem de cumprir com suas obrigações. ",  
                  size:25, 
                  font: "Arial"
                },
              ]),
              space,  space,
              this.gerarParagrafo(
              [{ text:"Cláusula 11ª - Disposições Gerais",  
                bold:true, 
                size:25, 
                font: "Arial"
              }]),
              space, space,
              this.gerarParagrafo(
                [{ text:"        • O presente contrato é celebrado em caráter irrevogável e irretratável; ",
                  bold:true,
                  size:25, 
                  font: "Arial"
                }
              ]),
              this.gerarParagrafo(
                [{ text:`        • As partes elegem o Foro da Comarca de ${formControls?.get('cartorio')?.get('cidadeUf')?.value} para dirimir qualquer litígio que possa surgir em decorrência deste contrato. `,
                    size:25, 
                    font: "Arial"
                  }
              ]),
              this.gerarParagrafo(
                [{ text:`        • Caso o CONTRATANTE venha fazer venda de sua propriedade objeto da regularização, esse se compromete a quitar todas as parcelas deste contrato, mesmo que não vencidas, bem como pagará ao CONTRATADO a quantia referente a 30% do valor contratado, para suprir os serviços de mudança de proprietário, no qual deverá fornecer os dados do adquirente antes do envio dos serviços à ${this.prefeituraNome} `,
                    size:25, 
                    font: "Arial"
                  }
              ]),
              space,  space,
              this.gerarParagrafo(
              [{ text:"E, por estarem assim justos e acordados, assinam o presente contrato em duas vias de igual teor e forma, na presença de duas testemunhas.",  
                bold:true, 
                size:25, 
                font: "Arial"
              }]),
              space, space,
              this.gerarParagrafo(
              [{ text: formControls?.get('cartorio')?.get('cidadeUf')?.value + ", " + (formControls?.get('createdAt')?.value !== null ? this.obterData(new Date(formControls?.get('createdAt')?.value.seconds * 1000 + formControls?.get('createdAt')?.value.nanoseconds / 1e6)): this.obterData()),  
                bold:true, 
                size:25, 
                font: "Arial"
              }]),
              space, space,

              space, space,
              formControls?.get('assinaturaContratante')?.value == '' || 
              formControls?.get('assinaturaContratante')?.value == null ||
              formControls?.get('assinaturaContratante')?.value == undefined 
              ? space
              : new Paragraph({
                children: [await this.assinatura(formControls?.get('assinaturaContratante')?.value)],
              }),

              this.gerarParagrafo(
                [{ text: "_____________________________________________"
                 ,  
                  bold:true, 
                  size:25, 
                  font: "Arial"
                }]),
              space,
              this.gerarParagrafo(
              [{ text:"CONTRATANTE",  
                bold:true, 
                size:25, 
                font: "Arial"
              }]),
              space, space,
              space, space,
              space, space, 
              
              formControls?.get('assinaturaContratada')?.value == '' || 
              formControls?.get('assinaturaContratada')?.value == null ||
              formControls?.get('assinaturaContratada')?.value == undefined 
                ? space
                :  new Paragraph({
                  children: [await this.assinatura(formControls?.get('assinaturaContratada')?.value)],
                }),

              this.gerarParagrafo(
              [{ text: "_____________________________________________"
               ,  
                bold:true, 
                size:25, 
                font: "Arial"
              }]) 
              ,
              space,
              this.gerarParagrafo(
              [{ text:"CONTRATADA",  
                bold:true, 
                size:25, 
                font: "Arial"
              }]),
              space, space,
              space, space,
              this.gerarParagrafo(
                [{ text:"Testemunhas: ",  
                  bold:true, 
                  size:25, 
                  font: "Arial"
                }]),
                space, space, space, space,
                formControls?.get('assinaturaTesteminha1')?.value == '' || 
                formControls?.get('assinaturaTesteminha1')?.value == null ||
                formControls?.get('assinaturaTesteminha1')?.value == undefined 
                ? space
                : new Paragraph({
                  children: [await this.assinatura(formControls?.get('assinaturaTesteminha1')?.value)],
                }),
                this.gerarParagrafo(
                  [{ text: "1._____________________________________________"
                   ,  
                    bold:true, 
                    size:25, 
                    font: "Arial"
                  }]),
              
              space,    space,    space,  
              formControls?.get('assinaturaTesteminha2')?.value == '' || 
              formControls?.get('assinaturaTesteminha2')?.value == null ||
              formControls?.get('assinaturaTesteminha2')?.value == undefined 
              ?space
              : new Paragraph({
                children: [await this.assinatura(formControls?.get('assinaturaTesteminha2')?.value)],
              }),
              this.gerarParagrafo(
                [{ text: "2._____________________________________________"
                 ,  
                  bold:true, 
                  size:25, 
                  font: "Arial"
                }]) ,
              space, space,
            ]
            
        },
    ]
});

  this.generateWord(doc, formControls?.get('contratante')?.get('nome')?.value);
}
}
