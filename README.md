# LUCREE VENDAS

<p align="center">
    <img loading="lazy" src="https://img.shields.io/badge/status-em%20desenvolvimento-yellow"/>
</p>

![Badge de Versão](https://img.shields.io/badge/vers%C3%A3o-1.0.0-green)

## Índice

- [LUCREE VENDAS](#lucree-vendas)
  - [Índice](#índice)
  - [Descrição](#descrição)
  - [Instalação](#instalação)
  - [Uso](#uso)
  - [Pacotes](#pacotes)
  - [Apoio](#apoio)

## Descrição

O **Lucree Vendas** é um aplicativo desenvolvido em Kotlin, projetado para realizar transações financeiras na maquininha GPOS700X. Utilizando a biblioteca de integração (SDK) Android v3.5.0 da Gsurf.

## Instalação

1. Clone o repositório:
    git clone https://....@bitbucket.org/bevipag/apk-lucree-vendas.git

2. Instale as dependências:
    ./gradlew build

3. Instale o aplicativo no dispositivo:
    ./gradlew installGpos700homologDebug

4. Gere o APK em modo Debug:
   ./gradlew assembleDebug
   Após gerar o APK no modo Debug, ele será encontrado na pasta: app/build/outputs/apk/gpos700homolog/debug

5. Gere o APK em modo Release:
    ./gradlew assembleRelease
    Após gerar o APK no modo Release, ele será encontrado na pasta: app/build/outputs/apk/gpos700homolog/release

6. Limpeza do projeto:
   ./gradlew clean

## Uso

Após a instalação, abra o aplicativo no dispositivo Android para iniciar as operações de pagamento.

## Pacotes

Abaixo estão os pacotes de aplicativos registrados até o momento, junto com seus respectivos applicationId: (Cupom - applicationId)
9     - "com.gsurf.lucreevendassiqueira"
11    - "com.gsurf.lucreevendaskgm"

Caso seja necessário gerar pacotes para cupons diferentes, você precisará alterar alguns arquivos do projeto:

build.grandle (module :app)
![alt text](image.png)

settings.grandle
![alt text](image-1.png)

app/src/main/res/values/strings.xml
![alt text](image-2.png)

app/src/main/java/com/gsurf/lucreevendas/model/ParamsVoucherNumber.kt
![alt text](image-3.png)

Após gerar o APK no modo Release, ele será encontrado na pasta: app/build/outputs/apk/gpos700homolog/release

## Apoio

Para mais informações sobre a biblioteca de integração (SDK) Android v3.5.0 da Gsurf, consulte a documentação oficial:
https://docs.gsurfnet.com/docs/manuais-de-utiliza-o/f0263b9432aa9-documentacao-da-biblioteca-de-integracao-sdk-android-v3-5-0#gertec-gpos700

Para exemplos de desenvolvimento, visite o repositório oficial da Gertec no GitHub:
https://github.com/gertecdeveloper/Gpos700X/tree/main/Kotlin
