import React from 'react';
import "./index.css"

function Index(props: {}) {


    return (
        <header className={"header"}>
            <div className={"header-logo"}>
                <span>
                    <svg viewBox="0 0 64 36" xmlns="http://www.w3.org/2000/svg" className="sc-49c604f9-1 WQCZw"
                         width={32} height={32}
                    >
                        <path fill="black"
                              d="M41.3111 0H37.6444C30.3111 0 24.6889 4.15556 21.7556 9.28889C18.8222 3.91111 12.9556 0 5.86667 0H2.2C0.977781 0 0 0.977779 0 2.2V5.86667C0 16.1333 8.31111 24.2 18.3333 24.2H19.8V33C19.8 34.2222 20.7778 35.2 22 35.2C23.2222 35.2 24.2 34.2222 24.2 33V24.2H25.6667C35.6889 24.2 44 16.1333 44 5.86667V2.2C43.5111 0.977779 42.5333 0 41.3111 0ZM19.3111 19.5556H17.8444C10.2667 19.5556 4.15556 13.4444 4.15556 5.86667V4.4H5.62222C13.2 4.4 19.3111 10.5111 19.3111 18.0889V19.5556ZM39.1111 5.86667C39.1111 13.4444 33 19.5556 25.4222 19.5556H23.9556V18.0889C23.9556 10.5111 30.0667 4.4 37.6444 4.4H39.1111V5.86667Z"
                              className="sc-49c604f9-0 btsKug"></path>
                    </svg>
                    PDF.ai
                </span>
            </div>
            <div>
                <div className={"header-menu"}>
                    <span className={"hover:underline"}>Pricing</span>
                    <span className={"hover:underline"}>Chrome extension</span>
                    <span className={"hover:underline"}>Use cases</span>
                    <span className={"hover:underline"}>Get started</span>
                </div>
            </div>
        </header>
    );
}

export default Index;
