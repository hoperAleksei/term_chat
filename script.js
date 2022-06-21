function print_message(login, message) {
    let terminal = document.getElementById("terminal");

    let line = document.createElement("div")
    line.className = "line";

    let ps = document.createElement("div");
    ps.className = "mes";
    ps.innerText = login+"@server-edu:/chat/# ";

    let oup = document.createElement("span");
    oup.innerText = message;

    line.append(ps);
    line.append(oup);
    terminal.append(line);

}

function print_prompt(pss, inp_id, inp_name, inp_type) {
    let terminal = document.getElementById("terminal");

    let line = document.createElement("div")
    line.className = "line";

    let ps = document.createElement("div");
    ps.className = "ps";
    ps.innerText = pss;

    let inp = document.createElement("input");
    inp.id = inp_id;
    inp.name = inp_name;
    inp.type = inp_type;
    inp.onkeydown=(() => (inp.style.width = ((inp.value.length + 1) * 8) + 'px'));
    inp.setAttribute("maxlength", "120");

    line.append(ps);
    line.append(inp);
    terminal.append(line);
    inp.focus();

    return inp;
}

function print_report(report) {
    let terminal = document.getElementById("terminal");

    let line = document.createElement("div")
    line.className = "line";
    line.innerText = report;

    terminal.append(line);

}

function clear_login_passwd(){
    document.getElementById("passwd").removeAttribute("id")
    document.getElementById("login").removeAttribute("id")
}


function print_login() {

    let login = print_prompt("Chat login: ", "login", "login", "text")

    let el = () => {login.focus()};

    login.addEventListener("blur", el)

    login.addEventListener("keyup", function (event) {

        console.log(event.key)
        if (event.key === "Enter") {
            login.removeEventListener("blur", el)
            print_passwd();
            login.disabled = true;
            console.log(1231)
        }
    });

}

function print_passwd() {

    let passwd = print_prompt("Chat password: ", "passwd", "passwd", "text")

    let el = () => {passwd.focus()};

    passwd.addEventListener("blur", el);

    passwd.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            passwd.removeEventListener("blur", el);
            login();
            passwd.disabled = true;
            console.log(1231)
        }
    })

}

function print_help() {
    print_report("Available commands:\n" +
        "help - prints this text\n" +
        "say <message> - adds <message> to the board\n" +
        "view - displays all messages\n" +
        "bye - exit terminal")
}

async function say_message(message) {
    if (message === null) {
        print_report("You try to say empty message, look help")
    } else {
        console.log(message)
        let text = message[2]

        let data = JSON.stringify({
            method: "say",
            login: document.cookie.match( '(^|;) ?' + "login" + '=([^;]*)(;|$)' )[2],
            message: text
        });

        let response = await fetch("login.php", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: data
        })

        let res = undefined;

        if (response.ok) {

            res = await response.json();

            print_message(res["login"], res["message"])
        } else {
            print_report("server access error");
        }

        return 1;
    }
}

async function view_messages() {
    let data = JSON.stringify({
        method: "view"
    });

    let response = await fetch("login.php", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: data
    })

    let res = undefined;

    if (response.ok) {

        res = await response.json();

        for (let i = 0; i < res.length; ++i) {
            print_message(res[i].login, res[i].message)
        }

    } else {
        print_report("server access error");
    }

    return 1;
}


async function run_command(command) {
    if (command.length > 0) {
        switch (command.match("^[^ ]+")[0]) {
            case "help":
                print_help();
                print_main();
                break;
            case "say":
                await say_message(command.match("(^[^ ]+?) (.+)"))
                print_main();
                break;
            case "view":
                await view_messages();
                print_main();
                break;
            case "bye":
                break;
            default:
                print_report("Unknown command: " + command.match("^[^ ]+")[0]);
                print_main()
                break;
        }
    } else {
        print_main()
    }
}


function print_main() {
    let command = print_prompt(
        document.cookie.match ( '(^|;) ?' + "login" + '=([^;]*)(;|$)' )[2]+"@server-edu:/chat/# ",
        "prompt",
        "prompt",
        "text"
    )

    let el = () => {command.focus()};

    command.addEventListener("blur", el);

    command.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            command.removeEventListener("blur", el);
            command.removeAttribute("id")
            command.disabled = true;
            run_command(command.value)
        }
    })

}


async function login() {
    let login = document.getElementById("login").value;
    let passwd = document.getElementById("passwd").value;

    let data = JSON.stringify({
        method: "login",
        login: login,
        passwd: passwd
    });

    let response = await fetch("login.php", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: data
    })

    let res = undefined;

    if (response.ok) {

        res = await response.json();

        if (res["state"] === "ok"){
            print_report("Login successful")
            print_main()
        } else {
            print_report("Invalid login or password");
            clear_login_passwd();
            print_login();
        }
    }
    else {
        print_report("server access error");
    }

    console.log(res)


}

window.onload = () => {
    // document.getElementById("terminal").
    // document.getElementById("terminal").removeEventListener("click")
    print_login()
};