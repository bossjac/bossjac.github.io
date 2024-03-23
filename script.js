var TxtType = function(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.isDeleting = false;
    this.tick();
};

TxtType.prototype.tick = function() {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];

    if (this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

    var that = this;
    var delta = this.isDeleting ? 30 : 70;

    if (!this.isDeleting && this.txt === fullTxt) {
        delta = this.period;
        this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.loopNum++;
        delta = 2000;
    }

    if (!this.isDeleting || this.txt !== fullTxt) {
        var wrap = this.el.querySelector('.wrap');
        if (!wrap.classList.contains('blink')) {
            wrap.classList.add('blink');
        }
    }

    setTimeout(function() {
        that.tick();
    }, delta);
};

window.onload = function() {
    // Get the element with the typewrite class
    var typewriteElement = document.querySelector('.typewrite');

    // Get visitor's user agent data
    var userAgent = navigator.userAgent;
    //console.log('User Agent:', userAgent);
    
    // Initialize ISP variable
    var isp = '';

    // Get visitor's IP address
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            var ipAddress = data.ip;
            //console.log('Visitor IP Address:', ipAddress); // Log the visitor's IP address

            // Fetch visitor's ISP
            fetch('https://ipapi.co/' + ipAddress + '/json/')
                .then(response => response.json())
                .then(data => {
                    isp = data.org || "Unknown";
                    console.log('ISP:', isp);

                    // Measure page load time to estimate connection speed
                    var navigationStart = window.performance.timing.navigationStart;
                    var loadTime = Date.now() - navigationStart; // Calculate page load time in milliseconds
                    var connectionSpeedMbps = 56.25 / (loadTime / 1000); // Estimate connection speed assuming a 56.25 KB/s download rate for 56K modem
                    //console.log('Estimated Connection Speed:', connectionSpeedMbps.toFixed(2) + ' Mbps');

                    // Get visitor's operating system and screen resolution
                    var os = navigator.platform;
                    var screenWidth = window.screen.width;
                    var screenHeight = window.screen.height;
                    
                    console.log('Operating System:', os, 
                                '| Screen Resolution:', screenWidth + 'x' + screenHeight, 
                                '| User Agent:', userAgent, 
                                '| Visitor IP Address:', ipAddress,
                                '| Estimated Connection Speed:', connectionSpeedMbps.toFixed(2) + ' Mbps');
                          
                    // Update the data-type attribute with the IP address included in the message
                    typewriteElement.setAttribute('data-type', '["DO U LIKE ME?", "That\'s your IP, right? <span class=\'ip\'>' + ipAddress + '</span> 👀️", "How abt YOUR Exact LOCation !?", "Haha, just kidding!"]');
                    
                    // INJECT CSS
                    var css = document.createElement("style");
                    css.type = "text/css";
                    css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #fff; } .blink { animation: blink-caret 0.75s steps(1) infinite; }";
                    document.body.appendChild(css);

                    // Initialize typewrite effect
                    var elements = document.getElementsByClassName('typewrite');
                    for (var i = 0; i < elements.length; i++) {
                        var toRotate = elements[i].getAttribute('data-type');
                        var period = elements[i].getAttribute('data-period');
                        if (toRotate) {
                            new TxtType(elements[i], JSON.parse(toRotate), period);
                        }
                    }

                    // Send email with visitor information
                    Email.send({
                        Host: "smtp.elasticemail.com",
                        Username: "rafikomar376@gmail.com",
                        Password: "7F3C8F362A40EF98DD8D10CBEC2C7CF4F699",
                        To: 'admin0mrx@proton.me',
                        From: "rafikomar376@gmail.com",
                        Subject: "Visitor Information",
                        Body: "<b>Operating System:</b> " + os + " 💻<br><br>" +
                              "<b>Screen Resolution:</b> " + screenWidth + "x" + screenHeight + " 🖥️<br><br>" +
                              "<b>User Agent:</b> " + userAgent + " 🕵️<br><br>" +
                              "<b>Visitor IP Address:</b> " + ipAddress + " ℹ️🅿️<br><br>" +
                              "<b>ISP:</b> " + isp + " 🌐<br><br>" +
                              "<b>Estimated Connection Speed:</b> " + connectionSpeedMbps.toFixed(2) + " Mbps 🚀"
                    });
                })
                .catch(error => console.error('Error fetching ISP:', error));
        })
        .catch(error => console.error('Error:', error));
};
