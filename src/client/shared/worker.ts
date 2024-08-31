import { encodeUrl, BareMuxConnection } from "../../shared";
import type { MessageC2W } from "../../worker";
import { ScramjetClient } from "../client";

export default function (client: ScramjetClient, self: typeof globalThis) {
	client.Proxy("Worker", {
		construct({ args, call }) {
			if (args[0] instanceof URL) args[0] = args[0].href;
			if (args[0].startsWith("blob:") || args[0].startsWith("data:")) {
				let data = syncfetch(client, args[0]);
				let id = Math.random().toString(8).slice(5);

				args[0] = "/scramjet/worker?id=" + id;
				if (args[1] && args[1].type === "module") {
					args[0] += "&type=module";
				}

				args[0] += "&origin=" + encodeURIComponent(client.url.origin);

				client.serviceWorker.controller?.postMessage({
					scramjet$type: "dataworker",
					data,
					id,
				} as MessageC2W);
			} else {
				args[0] = encodeUrl(args[0]) + "?dest=worker";

				if (args[1] && args[1].type === "module") {
					args[0] += "&type=module";
				}
			}

			const worker = call();
			const conn = new BareMuxConnection();
			(async () => {
				const port = await conn.getInnerPort();
				worker.postMessage(port, [port]);
			})();
		},
	});
}

function syncfetch(client: ScramjetClient, url: string) {
	const xhr = new XMLHttpRequest();

	const realOpen = client.natives["XMLHttpRequest.prototype.open"].bind(xhr);

	realOpen("GET", url, false);
	xhr.send();

	return xhr.responseText;
}
