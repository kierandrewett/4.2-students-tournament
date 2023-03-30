/// <reference types="vite/client" />

declare module "*.xlsx" {
	const content: any;
	export default content;
}
