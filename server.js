const http = require('http');

// cPanel / Phusion Passenger requires using process.env.PORT exactly as provided
const PORT = process.env.PORT || 3000;

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chittagong Trail - Coming Soon</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;800&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-deep: #0c1210;
            --bg-card: rgba(18, 30, 24, 0.75);
            --primary: #10b981;
            --primary-glow: rgba(16, 185, 129, 0.3);
            --text-main: #f1f5f9;
            --text-muted: #94a3b8;
            --accent: #34d399;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background-color: var(--bg-deep);
            color: var(--text-main);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            overflow-x: hidden;
            position: relative;
        }

        /* Background Nature Atmosphere */
        .hero-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(12, 18, 16, 0.95), rgba(5, 10, 8, 0.98)),
                        url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2000&auto=format&fit=crop') no-repeat center center/cover;
            z-index: -1;
            filter: brightness(0.6);
        }

        .container {
            width: 100%;
            max-width: 800px;
            padding: 2rem;
            text-align: center;
            z-index: 1;
        }

        .badge {
            display: inline-block;
            padding: 0.5rem 1.25rem;
            background: rgba(16, 185, 129, 0.15);
            border: 1px solid rgba(16, 185, 129, 0.4);
            color: var(--accent);
            border-radius: 50px;
            font-size: 0.85rem;
            font-weight: 600;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-bottom: 2rem;
            animation: fadeInDown 1s ease-out;
        }

        h1 {
            font-family: 'Playfair Display', serif;
            font-size: clamp(2.5rem, 6vw, 4.5rem);
            font-weight: 700;
            line-height: 1.1;
            margin-bottom: 1.5rem;
            color: #ffffff;
            letter-spacing: -0.02em;
            animation: fadeInUp 1s ease-out 0.2s both;
        }

        h1 span {
            color: var(--primary);
            font-style: italic;
        }

        p.tagline {
            font-size: clamp(1rem, 2vw, 1.25rem);
            color: var(--text-muted);
            max-width: 600px;
            margin: 0 auto 3rem auto;
            line-height: 1.6;
            font-weight: 300;
            animation: fadeInUp 1s ease-out 0.4s both;
        }

        /* Countdown Grid */
        .countdown {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1rem;
            max-width: 500px;
            margin: 0 auto 3rem auto;
            animation: fadeInUp 1s ease-out 0.6s both;
        }

        .countdown-box {
            background: var(--bg-card);
            border: 1px solid rgba(255, 255, 255, 0.08);
            padding: 1.25rem 1rem;
            border-radius: 16px;
            backdrop-filter: blur(10px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            transition: transform 0.3s ease, border-color 0.3s ease;
        }

        .countdown-box:hover {
            transform: translateY(-5px);
            border-color: rgba(16, 185, 129, 0.4);
        }

        .countdown-number {
            font-size: clamp(1.75rem, 3vw, 2.5rem);
            font-weight: 800;
            color: #ffffff;
            margin-bottom: 0.25rem;
            font-variant-numeric: tabular-nums;
        }

        .countdown-label {
            font-size: 0.75rem;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 600;
        }

        /* Notify Form */
        .notify-form {
            display: flex;
            gap: 0.75rem;
            max-width: 450px;
            margin: 0 auto;
            animation: fadeInUp 1s ease-out 0.8s both;
        }

        .notify-input {
            flex: 1;
            padding: 0.9rem 1.25rem;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 12px;
            color: #ffffff;
            font-size: 0.95rem;
            font-family: inherit;
            outline: none;
            transition: all 0.3s ease;
        }

        .notify-input:focus {
            border-color: var(--primary);
            background: rgba(255, 255, 255, 0.08);
            box-shadow: 0 0 15px var(--primary-glow);
        }

        .notify-btn {
            padding: 0.9rem 1.75rem;
            background: var(--primary);
            color: #0c1210;
            border: none;
            border-radius: 12px;
            font-weight: 700;
            font-size: 0.95rem;
            font-family: inherit;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 20px var(--primary-glow);
            white-space: nowrap;
        }

        .notify-btn:hover {
            background: #059669;
            color: #ffffff;
            transform: translateY(-2px);
        }

        footer {
            position: absolute;
            bottom: 1.5rem;
            font-size: 0.85rem;
            color: var(--text-muted);
            letter-spacing: 0.5px;
            animation: fadeIn 1.5s ease-out;
        }

        @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @media (max-width: 576px) {
            .container { padding: 1.5rem; }
            .notify-form { flex-direction: column; }
            .countdown { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
        }
    </style>
</head>
<body>
    <div class="hero-bg"></div>

    <div class="container">
        <div class="badge">Adventure Awaits</div>
        <h1>Chittagong <span>Trail</span></h1>
        <p class="tagline">Embark on an extraordinary journey through the majestic hills, lush green valleys, and untamed wilderness of Bangladesh. Something unforgettable is coming.</p>

        <div class="countdown">
            <div class="countdown-box">
                <div class="countdown-number" id="days">45</div>
                <div class="countdown-label">Days</div>
            </div>
            <div class="countdown-box">
                <div class="countdown-number" id="hours">12</div>
                <div class="countdown-label">Hours</div>
            </div>
            <div class="countdown-box">
                <div class="countdown-number" id="minutes">30</div>
                <div class="countdown-label">Minutes</div>
            </div>
            <div class="countdown-box">
                <div class="countdown-number" id="seconds">00</div>
                <div class="countdown-label">Seconds</div>
            </div>
        </div>

        <form class="notify-form" onsubmit="event.preventDefault(); alert('Thank you! We will notify you when the trail opens.');">
            <input type="email" class="notify-input" placeholder="Enter your email address" required>
            <button type="submit" class="notify-btn">Notify Me</button>
        </form>
    </div>

    <footer>
        &copy; 2026 Chittagong Trail. All rights reserved.
    </footer>

    <script>
        const targetDate = new Date().getTime() + (45 * 24 * 60 * 60 * 1000);

        function updateCountdown() {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                document.getElementById('days').innerText = String(days).padStart(2, '0');
                document.getElementById('hours').innerText = String(hours).padStart(2, '0');
                document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
                document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
            }
        }

        setInterval(updateCountdown, 1000);
        updateCountdown();
    </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(htmlContent);
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
