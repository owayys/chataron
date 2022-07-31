var url = window.location.pathname;
var filename = url.substring(url.lastIndexOf('/')+1);

document.getElementById("pfp-input").onchange = function() {
    document.getElementById("pfp-form").submit();
};

// $("#profile-pic").attr("src", `/images/${$('#user_name').text()}.png`)

function bubbleBackground(messageName){
    const prefix = 'bg-'
    
    if (messageName === $('#user_name').text()) {
        return (prefix + 'orang');
    }
    else {
        return (prefix + 'dark-porp')
    }
}

function nameCheck(messageName){
    if (messageName === $('#user_name').text()) {
        return ("You");
    }
    else {
        return (messageName)
    }
}

function adminCheck(userName) {
    const permString = "You do not have permission to send messages in this channel."
    const permString2 = "Message #" + filename;
    
    if (filename === 'announcements') {
        if (userName === 'Owais Ahsan') {
            return permString2;
        }
        else {
            $("#message-content-field").attr("readonly", true)
            return permString
        }
    }
    else {
        return permString2;
    }
}

function menuSlide() {
    if ($("#menu-button").hasClass("slideOut")) {
        $("#menu-button").addClass("rotate-90")
        $("#menu-list").removeClass("xl:-translate-x-full")

        $("#menu-button").removeClass("slideOut")
        $("#menu-button").addClass("slideIn")
    }
    else if ($("#menu-button").hasClass("slideIn")) {
        $("#menu-button").removeClass("rotate-90")
        $("#menu-list").addClass("xl:-translate-x-full")

        $("#menu-button").removeClass("slideIn")
        $("#menu-button").addClass("slideOut")
    }
}


const Form = (props) => {
    const setReload = props.reloadFunction
    const [content, setContent] = React.useState("")

    const post = (e) => {
        e.preventDefault();
        $.post(`/${filename}/new`, { content: content }, function(data) {
            setReload(cur => !cur)
            console.log(data);
        });
       setContent("");
       componentDidUpdate()
    }

    return <form id="message-form" className="w-full xl:pb-5 xl:justify-center xl:place-self-center" onSubmit={post}>
        <input placeholder={adminCheck($('#user_name').text())} id="message-content-field" value={content} onChange={(e) => {setContent(e.target.value)}} name="content" type="text" className="rounded-lg py-2 px-5 w-11/12 bg-white outline-none text-dark-porp xl:w-11/12 md:w-4/5" autoComplete="off"/>
        <button className="rounded-lg bg-green hover:bg-dark-green py-2 px-5 ml-3 text-white xl:px-4"><i className="fas fa-paper-plane"></i></button>
    </form>
}

const Messages = () => {

    const [messages, setMessages] = React.useState([])
    const [reload, setReload] = React.useState(false)

    $(`#${filename}`).removeClass("hover:bg-light-porp")
    $(`#${filename}`).addClass("bg-orang")
    $(`#${filename}`).addClass("text-white")

    $(`#${filename}link`).attr("href", "#")

    $(document).prop('title', `${filename}`);

    
    if (window.matchMedia('(max-width: 1280px)').matches) {
        $("#menu-button").prop("disabled", false);
        $("#logout-button").removeClass("hidden");
    } else if (window.matchMedia('(min-width: 1281px)').matches) {
        $("#menu-button").prop("disabled", true);
        $("#logout-button").addClass("hidden");
    } 

    const messageRef = React.useRef();

    React.useEffect(() => {
        console.log(filename)
        fetch(`/${filename}/all`)
        .then((data) => {
            data.json()
            .then(final_data => {
                console.log(final_data)
                setMessages(final_data);
            })
        })
        .catch((err) => {
            console.log(err);
        })
    }, [reload])

    React.useEffect(() => {
    if (messageRef.current) {
        messageRef.current.scrollIntoView(
        {
            behavior: 'smooth',
            block: 'end',
            inline: 'nearest'
        })
    }
    })

    return (
        <div className="xl:pl-2">
            <div className="overflow-y-auto max-h-82 w-full pr-3 items-end justify-end xl:text-sm xl:pl-2 sm:max-h-80">
                {messages.map((message, index) => (
                <div ref={messageRef} className="flex flex-row gap-3 items-start mt-4 pb-4 min-w-full" key={index}>
                    <img width="40px" height="40px" src={"/images/" + message.name + ".png"} onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src="/images/profile.png";
                        }} className="rounded-full w-12 h-12 xl:w-10 xl:h-10"></img>
                    <div>
                        <div className="flex flex-row gap-5">
                            <h3 className="text-white text-xl mb-2 xl:text-base">{nameCheck(message.name)}</h3>
                            <span>{message.date_time}</span>
                        </div>
                        <p className={'xl:text-base rounded-b-xl rounded-r-xl text-white p-3 max-w-fit ' + bubbleBackground(message.name)}>
                            {message.content}
                        </p>
                    </div>
                </div>
                ))}
            </div>
            <Form reloadFunction={setReload}/>
        </div>)
}

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<Messages></Messages>);