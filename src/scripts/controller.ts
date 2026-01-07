const BASE_URL = `https://api.machines.dev/v1/apps/${process.env.APP_NAME}/machines/${process.env.MACHINE_ID}`;

async function flyRequest(action: string) {
    const res = await fetch(`${BASE_URL}/${action}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.FLY_API_TOKEN}`,
            "Content-Type": "application/json",
        },
    });

    const body = await res.json();

    return { res, body };
}

async function start() {
    return await flyRequest("start").then(({ res, body }) => {
        if (res.ok) {
            console.log("Manhattan is awake!");
        } else {
            console.log(body);
        }
    });
}

async function stop() {
    await flyRequest("stop").then(({ res, body }) => {
        if (res.ok) {
            console.log("Manhattan is now sleeping...");
        } else {
            console.log(body);
        }
    });
}

//
const action = process.argv[2];

switch (action) {
    case "start":
        start();
        break;
    case "stop":
        stop();
        break;
    default:
        console.log("invalid action");
        process.exit(1);
}
