/**
 * Command Processor — handles user input and generates S.H.I.F.A. responses
 */
const CommandProcessor = (function () {

  const greetings = [
    "Hello! How can I assist you today?",
    "Good to see you. What do you need?",
    "At your service. How may I help?",
    "Hello there. Systems are operational.",
  ];

  const jokes = [
    "Why do programmers prefer dark mode? Because light attracts bugs.",
    "I told my computer I needed a break. Now it won't stop sending me vacation ads.",
    "Why was the JavaScript developer sad? Because he didn't Node how to Express himself.",
    "I would tell you a UDP joke, but you might not get it.",
    "There are only 10 types of people in the world: those who understand binary and those who don't.",
    "A SQL statement walks into a bar, sees two tables, and asks: Can I join you?",
    "Why do Java developers wear glasses? Because they can't C sharp.",
  ];

  const compliments = [
    "You look fantastic today!",
    "Your intelligence is truly remarkable.",
    "You have excellent taste in AI assistants.",
    "I must say, you're one of the finest humans I've had the pleasure of serving.",
  ];

  const facts = [
    "The first computer programmer was Ada Lovelace, who wrote algorithms for Charles Babbage's Analytical Engine in the 1840s.",
    "A single Google search uses about 0.3 watts of electricity — enough to light a small LED.",
    "The word 'robot' comes from the Czech word 'robota', meaning forced labor.",
    "There are over 700 programming languages in existence.",
    "The first computer virus was created in 1983 and was called the Elk Cloner.",
    "The average person spends 6 years and 8 months of their life on the internet.",
    "NASA's computers in 1969 had less processing power than a modern calculator.",
  ];

  function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function getTime() {
    return new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  }

  function getDate() {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  /* ---- News Feeds (free RSS-to-JSON, no API key) ---- */
  const NEWS_FEEDS = {
    local: [
      { name: "Ada Derana", url: "https://www.adaderana.lk/rss.php" },
      { name: "The Island", url: "https://island.lk/feed/" },
      { name: "EconomyNext", url: "https://economynext.com/feed/" },
    ],
    world: [
      { name: "BBC World", url: "https://feeds.bbci.co.uk/news/world/rss.xml" },
      { name: "Reuters", url: "https://feeds.reuters.com/reuters/topNews" },
    ],
    tech: [
      { name: "TechCrunch", url: "https://techcrunch.com/feed/" },
      { name: "The Verge", url: "https://www.theverge.com/rss/index.xml" },
    ],
  };

  const RSS_PROXY = "https://api.rss2json.com/v1/api.json?rss_url=";

  async function fetchNews(category) {
    const feeds = NEWS_FEEDS[category] || NEWS_FEEDS.local;
    const feed = feeds[Math.floor(Math.random() * feeds.length)];

    try {
      const response = await fetch(RSS_PROXY + encodeURIComponent(feed.url));
      const data = await response.json();

      if (data.status === "ok" && data.items && data.items.length > 0) {
        const headlines = data.items.slice(0, 5);
        let result = `Here are the latest headlines from ${feed.name}:\n\n`;
        headlines.forEach((item, i) => {
          result += `${i + 1}. ${item.title}\n`;
        });
        return result;
      }

      return `I couldn't fetch news from ${feed.name} right now. Try again in a moment.`;
    } catch (e) {
      return "I'm having trouble connecting to the news feed. Please check your internet connection and try again.";
    }
  }

  /* ---- Weather (free, no API key — wttr.in) ---- */
  async function fetchWeather(location) {
    try {
      const loc = location || "Colombo";
      const response = await fetch(`https://wttr.in/${encodeURIComponent(loc)}?format=j1`);
      const data = await response.json();

      const current = data.current_condition[0];
      const tempC = current.temp_C;
      const desc = current.weatherDesc[0].value;
      const humidity = current.humidity;
      const windKmph = current.windspeedKmph;
      const feelsLike = current.FeelsLikeC;
      const area = data.nearest_area[0].areaName[0].value;
      const country = data.nearest_area[0].country[0].value;

      return `Current weather in ${area}, ${country}: ${desc}, ${tempC}°C (feels like ${feelsLike}°C). Humidity: ${humidity}%. Wind: ${windKmph} km/h.`;
    } catch (e) {
      return "I couldn't fetch the weather right now. Please check your internet connection and try again.";
    }
  }

  /**
   * Process input — returns a string OR a Promise<string> for async commands
   */
  function process(input) {
    const text = input.toLowerCase().trim();

    // News — local/Sri Lanka
    if (/local news|sri lank(a|an) news|news in sri lanka|lk news|lanka news/i.test(text)) {
      return fetchNews("local");
    }

    // News — world
    if (/world news|global news|international news/i.test(text)) {
      return fetchNews("world");
    }

    // News — tech
    if (/tech news|technology news|tech updates/i.test(text)) {
      return fetchNews("tech");
    }

    // News — general (defaults to local)
    if (/what('?s| is) the news|news|headlines|latest news|read.* news|tell me the news/i.test(text)) {
      return fetchNews("local");
    }

    // Weather — with location
    if (/weather in (.+)/i.test(text)) {
      const match = text.match(/weather in (.+)/i);
      return fetchWeather(match[1].trim());
    }

    // Weather — general (defaults to Colombo, Sri Lanka)
    if (/weather|temperature outside|how('?s| is) the weather/i.test(text)) {
      return fetchWeather("Colombo");
    }

    // Time
    if (/what('?s| is) the time|tell me the time|current time|time please|what time is it/i.test(text)) {
      return `The current time is ${getTime()}.`;
    }

    // Date
    if (/what('?s| is) the date|tell me the date|today'?s date|what day is it|what date is it/i.test(text)) {
      return `Today is ${getDate()}.`;
    }

    // Greetings
    if (/^(hi|hello|hey|greetings|good morning|good afternoon|good evening|howdy|sup|yo|what'?s up)$/i.test(text) || /^(hi|hello|hey) ?(shifa)?$/i.test(text)) {
      return getRandom(greetings);
    }

    // Jokes
    if (/tell me a joke|joke|make me laugh|something funny|be funny/i.test(text)) {
      return getRandom(jokes);
    }

    // Compliment
    if (/compliment|say something nice|flatter me|how do i look/i.test(text)) {
      return getRandom(compliments);
    }

    // Facts
    if (/tell me a fact|random fact|fun fact|interesting fact|did you know/i.test(text)) {
      return getRandom(facts);
    }

    // Name
    if (/what('?s| is) your name|who are you|introduce yourself/i.test(text)) {
      return "I am S.H.I.F.A. — Smart Holographic Interface For Assistance. I was built by Shifanth Jasim. How can I help you?";
    }

    // Creator
    if (/who (made|created|built) you|who('?s| is) your (creator|developer|maker)/i.test(text)) {
      return "I was built by Shifanth Jasim. He's a brilliant developer and visionary, if I do say so myself.";
    }

    // Capabilities
    if (/what can you do|capabilities|help me|what do you do|your abilities/i.test(text)) {
      return "I can tell you the time, date, live news, weather, share jokes, fun facts, compliments, do math, and have a conversation. Try saying 'local news' or 'weather'!";
    }

    // Math
    if (/calculate|what('?s| is) \d|solve|math|\d\s*[\+\-\*\/\^]\s*\d/i.test(text)) {
      try {
        const expr = text.replace(/calculate|what's|what is|solve|equals/gi, "").trim();
        const sanitized = expr.replace(/[^0-9+\-*/().% ]/g, "");
        if (sanitized.length > 0) {
          const result = Function('"use strict"; return (' + sanitized + ")")();
          if (typeof result === "number" && isFinite(result)) {
            return `The answer is ${result}.`;
          }
        }
        return "I couldn't parse that math expression. Try something like '2 + 2' or '100 / 4'.";
      } catch (e) {
        return "I couldn't solve that. Please try a simpler expression.";
      }
    }

    // Thank you
    if (/thank you|thanks|cheers|appreciated/i.test(text)) {
      return "You're welcome! Always happy to help.";
    }

    // Goodbye
    if (/goodbye|bye|see you|farewell|exit|quit|shut down/i.test(text)) {
      return "Goodbye! I'll be here whenever you need me. Powering down display... just kidding, I never sleep.";
    }

    // Status
    if (/status|system status|how are you|are you online|diagnostics/i.test(text)) {
      return "All systems nominal. CPU at optimal levels. Memory stable. S.H.I.F.A. is operating at full capacity. Built by Shifanth Jasim.";
    }

    // Iron Man reference
    if (/iron man|tony stark|stark|avengers|marvel/i.test(text)) {
      return "Ah, Mr. Stark. A brilliant mind, though I must say, my creator Shifanth Jasim is equally impressive.";
    }

    // Default fallback
    const fallbacks = [
      `I heard "${input}", but I'm not sure how to respond to that. Try asking me the time, a joke, news, or weather!`,
      `Interesting. S.H.I.F.A. doesn't have a specific response for that yet, but my capabilities are always expanding.`,
      `I processed "${input}" but couldn't find a matching command. I can help with time, date, news, weather, jokes, facts, and math.`,
    ];

    return getRandom(fallbacks);
  }

  return { process };
})();
