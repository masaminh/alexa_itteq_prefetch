FROM public.ecr.aws/lambda/nodejs:16 AS builder
WORKDIR /usr/app
COPY package*.json tsconfig.json index.ts fetcher.ts formatter.ts logger.ts .puppeteerrc.cjs ./
RUN npm ci --ignore-scripts && npm run build

FROM public.ecr.aws/lambda/nodejs:16
RUN yum -y install libX11 libXcomposite libXcursor libXdamage libXext libXi libXtst cups-libs libXScrnSaver libXrandr alsa-lib pango atk at-spi2-atk gtk3 google-noto-sans-japanese-fonts
WORKDIR ${LAMBDA_TASK_ROOT}
COPY package*.json .puppeteerrc.cjs ./
RUN npm ci --omit=dev --ignore-scripts && node node_modules/puppeteer/install.js && npm cache clean --force
COPY --from=builder /usr/app/dist/* ./
USER nobody
CMD ["index.handler"]
