type Subcategory = {
  name: string;
  displayName: string;
};

export type Category = {
  name: string;
  displayName: string;
  subcategories?: {
    [key: string]: Subcategory;
  };
};

type Categories = {
  [key: string]: Category;
};

export const CATEGORIES: Categories = {
  home: { name: "", displayName: "Home" },
  latest: { name: "latest", displayName: "Latest" },
  news: {
    name: "news",
    displayName: "News",
    subcategories: {
      world: { name: "world", displayName: "World" },
      us: { name: "us", displayName: "US" },
      canada: { name: "canada", displayName: "Canada" },
      uk: { name: "uk", displayName: "UK" },
      europe: { name: "europe", displayName: "Europe" },
      ukraine: { name: "ukraine", displayName: "Ukraine" },
      middleeast: { name: "middleeast", displayName: "Middle East" },
    },
  },
  business: {
    name: "business",
    displayName: "Business",
    subcategories: {
      autos: { name: "autos", displayName: "Autos" },
      airlines: { name: "airlines", displayName: "Airlines" },
      retail: { name: "retail", displayName: "Retail" },
      food: { name: "food", displayName: "Food" },
      pharma: { name: "pharma", displayName: "Pharma" },
      politicsgov: {
        name: "politicsgov",
        displayName: "Politics and Government",
      },
    },
  },
  moneymarkets: {
    name: "moneymarkets",
    displayName: "Money & Markets",
    subcategories: {
      personalfinance: {
        name: "personalfinance",
        displayName: "Personal Finance",
      },
      economicindicators: {
        name: "economicindicators",
        displayName: "Economic Indicators",
      },
      earnings: { name: "earnings", displayName: "Earnings" },
      markets: { name: "markets", displayName: "Markets" },
      smartinvesting: {
        name: "smartinvesting",
        displayName: "Smart Investing",
      },
    },
  },
  techinnovation: {
    name: "techinnovation",
    displayName: "Tech & Innovation",
    subcategories: {
      news: { name: "technews", displayName: "News" },
      ai: { name: "ai", displayName: "AI" },
      emergingtechnologies: {
        name: "emergingtechnologies",
        displayName: "Emerging Technologies",
      },
      cloudcomputing: {
        name: "cloudcomputing",
        displayName: "Cloud Computing",
      },
      space: { name: "space", displayName: "Space" },
      cybersecurity: { name: "cybersecurity", displayName: "Cybersecurity" },
    },
  },
  science: {
    name: "science",
    displayName: "Science",
    subcategories: {
      nature: { name: "nature", displayName: "Nature" },
      naturalsciences: {
        name: "naturalsciences",
        displayName: "Natural Sciences",
      },
      socialsciences: {
        name: "socialsciences",
        displayName: "Social Sciences",
      },
      lifesciences: { name: "lifesciences", displayName: "Life Sciences" },
      earthsciences: { name: "earthsciences", displayName: "Earth Sciences" },
      astronomy: { name: "astronomy", displayName: "Astronomy" },
      physics: { name: "physics", displayName: "Physics" },
    },
  },
  culture: {
    name: "culture",
    displayName: "Culture",
    subcategories: {
      books: { name: "books", displayName: "Books" },
      music: { name: "music", displayName: "Music" },
      tvfilm: { name: "tvfilm", displayName: "TV and Film" },
      artdesign: { name: "artdesign", displayName: "Art and Design" },
      games: { name: "games", displayName: "Games" },
      classicalmusic: {
        name: "classicalmusic",
        displayName: "Classical Music",
      },
      stage: { name: "stage", displayName: "Stage" },
    },
  },
  lifestyle: {
    name: "lifestyle",
    displayName: "Lifestyle",
    subcategories: {
      fashion: { name: "fashion", displayName: "Fashion" },
      food: { name: "food", displayName: "Food" },
      cars: { name: "cars", displayName: "Cars" },
      healthfitness: {
        name: "healthfitness",
        displayName: "Health and Fitness",
      },
      homegarden: { name: "homegarden", displayName: "Home and Garden" },
      travel: { name: "travel", displayName: "Travel" },
      realestate: { name: "realestate", displayName: "Real Estate" },
    },
  },
};
