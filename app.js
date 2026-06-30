const data = {"categories": [{"name": "Malaysian Rice", "emoji": "🍛", "budget": "RM10–25", "foods": ["Nasi Ayam", "Nasi Lemak", "Nasi Kandar", "Nasi Campur", "Ayam Gepuk", "Ayam Penyet", "Briyani", "Banana Leaf Rice", "Claypot Chicken Rice", "Hainanese Chicken Rice", "Roast Duck Rice", "Fried Rice", "Nasi Padang", "Kam Heong Rice"]}, {"name": "Malaysian Noodles", "emoji": "🍜", "budget": "RM9–20", "foods": ["Pan Mee", "Curry Mee", "Sarawak Laksa", "Asam Laksa", "Mee Goreng", "Hokkien Mee", "Wantan Mee", "Kolo Mee", "Prawn Mee", "Mee Soto", "Mee Rebus", "Char Kuey Teow", "Dry Chili Pan Mee", "Ipoh Hor Fun"]}, {"name": "Hawker Favourites", "emoji": "🥟", "budget": "RM8–22", "foods": ["Dim Sum", "Yong Tau Foo", "Lok Lok", "Satay", "Chee Cheong Fun", "Curry Chee Cheong Fun", "Roti Canai", "Roti Telur", "Murtabak", "Pasembur", "Rojak", "Oyster Omelette", "Otak-Otak"]}, {"name": "Burgers & Sandwiches", "emoji": "🍔", "budget": "RM12–30", "foods": ["Burger", "Chicken Burger", "Beef Burger", "Sandwich", "Club Sandwich", "Chicken Wrap", "Hot Dog", "Subway-style Sandwich", "Grilled Cheese"]}, {"name": "Western", "emoji": "🍕", "budget": "RM18–45", "foods": ["Pizza", "Pasta", "Steak", "Fish & Chips", "Mac & Cheese", "Chicken Chop", "Lamb Chop", "Mushroom Soup & Garlic Bread", "Mixed Grill"]}, {"name": "Japanese", "emoji": "🍣", "budget": "RM18–50", "foods": ["Sushi", "Ramen", "Bento", "Donburi", "Japanese Curry Rice", "Udon", "Soba", "Gyoza", "Onigiri", "Katsu Don"]}, {"name": "Korean", "emoji": "🇰🇷", "budget": "RM18–45", "foods": ["Korean Fried Chicken", "Bibimbap", "Bulgogi", "Kimchi Stew", "Tteokbokki", "Kimbap", "Japchae", "Ramyeon"]}, {"name": "Mexican & Middle Eastern", "emoji": "🌮", "budget": "RM15–35", "foods": ["Tacos", "Burrito", "Shawarma", "Kebab", "Falafel Wrap", "Quesadilla", "Chicken Rice Bowl", "Hummus Plate"]}, {"name": "Healthy Choices", "emoji": "🥗", "budget": "RM15–35", "foods": ["Caesar Salad", "Chicken Salad", "Grain Bowl", "Poke Bowl", "Chicken Wrap", "Vegetarian Rice", "Soup & Bread", "Baked Potato", "Fruit Bowl"]}, {"name": "Café Lunch", "emoji": "☕", "budget": "RM15–40", "foods": ["Big Breakfast", "Toast Set", "Croissant Sandwich", "Soup & Bread", "Quiche", "Chicken Pie", "Pesto Pasta", "Egg Mayo Sandwich"]}, {"name": "Food Court Classics", "emoji": "🍱", "budget": "RM8–20", "foods": ["Economy Rice", "Mixed Rice", "Mixed Grill", "Honey Chicken Rice", "Sweet & Sour Fish Rice", "Sambal Squid Rice", "Butter Chicken Rice", "Salted Egg Chicken Rice"]}, {"name": "Fast Food", "emoji": "⚡", "budget": "RM12–30", "foods": ["Fried Chicken", "Burger Set", "Nuggets", "Wrap", "Fries Combo", "Chicken Tenders", "Fish Burger", "Spicy Chicken Burger"]}, {"name": "Chaos", "emoji": "🎲", "budget": "Fate decides", "foods": ["Your colleague decides", "First food you see on Grab", "Under RM15 Challenge", "Walk somewhere new", "Make it extra spicy", "Healthy only", "Spin again and accept", "Ask ChatGPT"]}, {"name": "Lucky", "emoji": "🌟", "budget": "Worth it", "foods": ["Golden Fork: Eat Anything", "Dessert Before Lunch", "Upgrade to Combo", "You Choose Everyone's Lunch", "Lucky Wallet", "Double Spin", "Buy Someone a Drink"]}, {"name": "Legendary", "emoji": "☠️", "budget": "RM0–??", "foods": ["Fast Today", "Leftovers Only", "No Phone During Lunch"]}, {"name": "Chef's Surprise", "emoji": "❓", "budget": "Mystery", "foods": []}], "challenges": ["Bring a colleague", "Try a drink you never order", "Rate lunch out of 10", "Take a food photo", "Sit with someone new", "No complaining for 30 minutes", "Recommend this food", "Find the cheapest version nearby"], "fortunes": ["May your queue be short and your portion generous.", "Good food, good mood, fewer 3pm snacks.", "A great conversation may be hiding behind this lunch.", "Today’s meal has main character energy.", "This is edible decision-making.", "The lunch machine has spoken."]};

const $ = id => document.getElementById(id);
const els = {
  sound:$("soundBtn"), spin:$("spinBtn"), copy:$("copyBtn"),
  catE:$("catEmoji"), dishE:$("dishEmoji"), chalE:$("chalEmoji"),
  catT:$("catText"), dishT:$("dishText"), chalT:$("chalText"),
  food:$("food"), catChip:$("categoryChip"), budget:$("budgetChip"),
  challenge:$("challengeChip"), fortune:$("fortune"),
  total:$("totalSpins"), topCat:$("topCategory"), topDish:$("topDish"), hist:$("historyList")
};

let current = null;
let soundOn = JSON.parse(localStorage.getItem("ljSound") ?? "true");
let history = JSON.parse(localStorage.getItem("ljHistory") ?? "[]");
let stats = JSON.parse(localStorage.getItem("ljStats") ?? '{"total":0,"categories":{},"foods":{}}');

const random = arr => arr[Math.floor(Math.random() * arr.length)];

function normalFoods() {
  return data.categories
    .filter(c => !["Chaos","Lucky","Legendary","Chef's Surprise"].includes(c.name))
    .flatMap(c => c.foods);
}

function setSound() {
  els.sound.textContent = soundOn ? "🔊" : "🔇";
}

function beep(freq=440, duration=.05, type="sine") {
  if (!soundOn) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.value = freq;
  osc.type = type;
  gain.gain.setValueAtTime(.045, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

function confetti(count=70) {
  const colors = ["#FFD166","#EF476F","#06D6A0","#118AB2","#C77DFF","#FF5A1F"];
  for (let i = 0; i < count; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti";
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.background = random(colors);
    piece.style.animationDelay = Math.random() * .35 + "s";
    piece.style.transform = `rotate(${Math.random()*360}deg)`;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 2300);
  }
}

function top(obj) {
  const entries = Object.entries(obj);
  return entries.length ? entries.sort((a,b) => b[1] - a[1])[0][0] : "-";
}

function save() {
  localStorage.setItem("ljHistory", JSON.stringify(history.slice(0,10)));
  localStorage.setItem("ljStats", JSON.stringify(stats));
}

function updatePanels() {
  els.total.textContent = stats.total || 0;
  els.topCat.textContent = top(stats.categories);
  els.topDish.textContent = top(stats.foods);
  els.hist.innerHTML = history.length
    ? history.map(x => `<li>${x.food} <small>(${x.category})</small></li>`).join("")
    : "<li>No spins yet.</li>";
}

function choose() {
  const category = random(data.categories);
  const dish = category.name === "Chef's Surprise" ? random(normalFoods()) : random(category.foods);
  return {
    category,
    dish,
    challenge: random(data.challenges),
    fortune: random(data.fortunes)
  };
}

function shuffleText() {
  const c = random(data.categories);
  els.catE.textContent = c.emoji;
  els.catT.textContent = c.name;
  els.dishE.textContent = random(["🍛","🍜","🥟","🍔","🍕","🍣","🥗","🍱","⚡","🌮"]);
  els.dishT.textContent = random(normalFoods());
  els.chalE.textContent = random(["🎯","👥","🌶️","💰","📸","⭐","🎲"]);
  els.chalT.textContent = random(data.challenges);
}

function record(result) {
  stats.total = (stats.total || 0) + 1;
  stats.categories[result.category.name] = (stats.categories[result.category.name] || 0) + 1;
  stats.foods[result.dish] = (stats.foods[result.dish] || 0) + 1;
  history.unshift({food: result.dish, category: result.category.name, time: new Date().toISOString()});
  history = history.slice(0,10);
  save();
  updatePanels();
}

function reveal(result) {
  current = result;
  els.catE.textContent = result.category.emoji;
  els.catT.textContent = result.category.name;
  els.dishE.textContent = result.category.emoji;
  els.dishT.textContent = result.dish;
  els.chalE.textContent = "🎯";
  els.chalT.textContent = result.challenge;
  els.food.textContent = result.dish;
  els.catChip.textContent = `${result.category.emoji} ${result.category.name}`;
  els.budget.textContent = `💰 ${result.category.budget}`;
  els.challenge.textContent = `🎯 ${result.challenge}`;
  els.fortune.textContent = result.fortune;
  record(result);
  beep(660,.08,"triangle");
  setTimeout(() => beep(880,.1,"triangle"), 90);
  if (["Lucky","Legendary","Chef's Surprise"].includes(result.category.name)) confetti(90);
}

function spin() {
  els.spin.disabled = true;
  document.querySelectorAll(".reel").forEach(r => r.classList.add("spinning"));
  els.food.textContent = "Spinning...";
  els.fortune.textContent = "The lunch machine is shuffling destiny.";
  const result = choose();
  let ticks = 0;
  const timer = setInterval(() => {
    shuffleText();
    beep(260 + ticks * 16, .025, "square");
    ticks++;
    if (ticks > 24) {
      clearInterval(timer);
      document.querySelectorAll(".reel").forEach(r => r.classList.remove("spinning"));
      reveal(result);
      els.spin.disabled = false;
    }
  }, 95);
}

async function copy() {
  const text = current
    ? `🎰 Lunch Jackpot: ${current.dish} (${current.category.name}) • ${current.category.budget} • ${current.challenge}`
    : "🎰 Lunch Jackpot: Not spun yet";
  try {
    await navigator.clipboard.writeText(text);
    els.copy.textContent = "✅";
    setTimeout(() => els.copy.textContent = "📋", 1000);
  } catch {
    alert(text);
  }
}

function init() {
  setSound();
  updatePanels();
  els.spin.addEventListener("click", spin);
  els.copy.addEventListener("click", copy);
  els.sound.addEventListener("click", () => {
    soundOn = !soundOn;
    localStorage.setItem("ljSound", JSON.stringify(soundOn));
    setSound();
  });
  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
      tab.classList.add("active");
      $(tab.dataset.tab + "Panel").classList.add("active");
    });
  });
}

init();
