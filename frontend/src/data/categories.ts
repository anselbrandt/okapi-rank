type Subcategory = {
  name: string;
  displayName: string;
  desc?: string;
  match_categories?: string[][];
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
  home: {
    name: "home",
    displayName: "Home",
  },
  latest: {
    name: "latest",
    displayName: "Latest",
    subcategories: {
      latest: {
        name: "latest_latest",
        displayName: "Latest",
        match_categories: [
          ["arts", "Books"],
          ["education", "Education"],
          ["news", "Business News"],
          ["news", "Daily News"],
          ["news", "News Commentary"],
          ["news", "News"],
          ["news", "Politics"],
          ["society_and_culture", "Documentary"],
          ["society_and_culture", "Philosophy"],
          ["society_and_culture", "Society & Culture"],
        ],
      },
    },
  },
  arts: {
    name: "arts",
    displayName: "Arts",
    subcategories: {
      arts: {
        name: "arts_arts",
        displayName: "Arts",
        match_categories: [["arts", "Arts"]],
      },
      books: {
        name: "arts_books",
        displayName: "Books",
        match_categories: [["arts", "Books"]],
      },
      design: {
        name: "arts_design",
        displayName: "Design",
        match_categories: [["arts", "Design"]],
      },
      fashion_beauty: {
        name: "arts_fashion_beauty",
        displayName: "Fashion & Beauty",
        match_categories: [["arts", "Fashion & Beauty"]],
      },
      food: {
        name: "arts_food",
        displayName: "Food",
        match_categories: [["arts", "Food"]],
      },
      performing_arts: {
        name: "arts_performing_arts",
        displayName: "Performing Arts",
        match_categories: [["arts", "Performing Arts"]],
      },
      visual_arts: {
        name: "arts_visual_arts",
        displayName: "Visual Arts",
        match_categories: [["arts", "Visual Arts"]],
      },
    },
  },
  business: {
    name: "business",
    displayName: "Business",
    subcategories: {
      business: {
        name: "business_business",
        displayName: "Business",
        match_categories: [["business", "Business"]],
      },
      careers: {
        name: "business_careers",
        displayName: "Careers",
        match_categories: [["business", "Careers"]],
      },
      entrepreneurship: {
        name: "business_entrepreneurship",
        displayName: "Entrepreneurship",
        match_categories: [["business", "Entrepreneurship"]],
      },
      investing: {
        name: "business_investing",
        displayName: "Investing",
        match_categories: [["business", "Investing"]],
      },
      management: {
        name: "business_management",
        displayName: "Management",
        match_categories: [["business", "Management"]],
      },
      marketing: {
        name: "business_marketing",
        displayName: "Marketing",
        match_categories: [["business", "Marketing"]],
      },
      non_profit: {
        name: "business_non_profit",
        displayName: "Non-Profit",
        match_categories: [["business", "Non-Profit"]],
      },
      tech_news: {
        name: "business_tech_news",
        displayName: "Tech News",
        match_categories: [["business", "Tech News"]],
      },
    },
  },
  comedy: {
    name: "comedy",
    displayName: "Comedy",
    subcategories: {
      comedy: {
        name: "comedy_comedy",
        displayName: "Comedy",
        match_categories: [["comedy", "Comedy"]],
      },
      comedy_interviews: {
        name: "comedy_comedy_interviews",
        displayName: "Comedy Interviews",
        match_categories: [["comedy", "Comedy Interviews"]],
      },
      improv: {
        name: "comedy_improv",
        displayName: "Improv",
        match_categories: [["comedy", "Improv"]],
      },
      stand_up: {
        name: "comedy_stand_up",
        displayName: "Stand-Up",
        match_categories: [["comedy", "Stand-Up"]],
      },
      stand_up_comedy: {
        name: "comedy_stand_up_comedy",
        displayName: "Stand-Up Comedy",
        match_categories: [["comedy", "Stand-Up Comedy"]],
      },
    },
  },
  education: {
    name: "education",
    displayName: "Business",
    subcategories: {
      business: {
        name: "education_business",
        displayName: "Business",
        match_categories: [["education", "Business"]],
      },
      business_news: {
        name: "education_business_news",
        displayName: "Business News",
        match_categories: [["education", "Business News"]],
      },
      comedy: {
        name: "education_comedy",
        displayName: "Comedy",
        match_categories: [["education", "Comedy"]],
      },
      courses: {
        name: "education_courses",
        displayName: "Courses",
        match_categories: [["education", "Courses"]],
      },
      education: {
        name: "education_education",
        displayName: "Education",
        match_categories: [["education", "Education"]],
      },
      golf: {
        name: "education_golf",
        displayName: "Golf",
        match_categories: [["education", "Golf"]],
      },
      health_fitness: {
        name: "education_health_fitness",
        displayName: "Health & Fitness",
        match_categories: [["education", "Health & Fitness"]],
      },
      history: {
        name: "education_history",
        displayName: "History",
        match_categories: [["education", "History"]],
      },
      how_to: {
        name: "education_how_to",
        displayName: "How To",
        match_categories: [["education", "How To"]],
      },
      investing: {
        name: "education_investing",
        displayName: "Investing",
        match_categories: [["education", "Investing"]],
      },
      language_learning: {
        name: "education_language_learning",
        displayName: "Language Learning",
        match_categories: [["education", "Language Learning"]],
      },
      news: {
        name: "education_news",
        displayName: "News",
        match_categories: [["education", "News"]],
      },
      news_commentary: {
        name: "education_news_commentary",
        displayName: "News Commentary",
        match_categories: [["education", "News Commentary"]],
      },
      personal_journals: {
        name: "education_personal_journals",
        displayName: "Personal Journals",
        match_categories: [["education", "Personal Journals"]],
      },
      politics: {
        name: "education_politics",
        displayName: "Politics",
        match_categories: [["education", "Politics"]],
      },
      running: {
        name: "education_running",
        displayName: "Running",
        match_categories: [["education", "Running"]],
      },
      self_improvement: {
        name: "education_self_improvement",
        displayName: "Self-Improvement",
        match_categories: [["education", "Self-Improvement"]],
      },
      society_culture: {
        name: "education_society_culture",
        displayName: "Society & Culture",
        match_categories: [["education", "Society & Culture"]],
      },
      sport: {
        name: "education_sport",
        displayName: "Sport",
        match_categories: [["education", "Sport"]],
      },
      true_crime: {
        name: "education_true_crime",
        displayName: "True Crime",
        match_categories: [["education", "True Crime"]],
      },
    },
  },
  fiction: {
    name: "fiction",
    displayName: "Comedy Fiction",
    subcategories: {
      comedy_fiction: {
        name: "fiction_comedy_fiction",
        displayName: "Comedy Fiction",
        match_categories: [["fiction", "Comedy Fiction"]],
      },
      drama: {
        name: "fiction_drama",
        displayName: "Drama",
        match_categories: [["fiction", "Drama"]],
      },
      fiction: {
        name: "fiction_fiction",
        displayName: "Fiction",
        match_categories: [["fiction", "Fiction"]],
      },
      science_fiction: {
        name: "fiction_science_fiction",
        displayName: "Science Fiction",
        match_categories: [["fiction", "Science Fiction"]],
      },
    },
  },
  government: {
    name: "government",
    displayName: "Government",
    subcategories: {
      government: {
        name: "government_government",
        displayName: "Government",
        match_categories: [["government", "Government"]],
      },
    },
  },
  health_and_fitness: {
    name: "health_and_fitness",
    displayName: "Alternative Health",
    subcategories: {
      alternative_health: {
        name: "health_and_fitness_alternative_health",
        displayName: "Alternative Health",
        match_categories: [["health_and_fitness", "Alternative Health"]],
      },
      fitness: {
        name: "health_and_fitness_fitness",
        displayName: "Fitness",
        match_categories: [["health_and_fitness", "Fitness"]],
      },
      health_fitness: {
        name: "health_and_fitness_health_fitness",
        displayName: "Health & Fitness",
        match_categories: [["health_and_fitness", "Health & Fitness"]],
      },
      medicine: {
        name: "health_and_fitness_medicine",
        displayName: "Medicine",
        match_categories: [["health_and_fitness", "Medicine"]],
      },
      mental_health: {
        name: "health_and_fitness_mental_health",
        displayName: "Mental Health",
        match_categories: [["health_and_fitness", "Mental Health"]],
      },
      nutrition: {
        name: "health_and_fitness_nutrition",
        displayName: "Nutrition",
        match_categories: [["health_and_fitness", "Nutrition"]],
      },
      sexuality: {
        name: "health_and_fitness_sexuality",
        displayName: "Sexuality",
        match_categories: [["health_and_fitness", "Sexuality"]],
      },
    },
  },
  history: {
    name: "history",
    displayName: "History",
    subcategories: {
      history: {
        name: "history_history",
        displayName: "History",
        match_categories: [["history", "History"]],
      },
    },
  },
  kids_and_family: {
    name: "kids_and_family",
    displayName: "Daily News",
    subcategories: {
      daily_news: {
        name: "kids_and_family_daily_news",
        displayName: "Daily News",
        match_categories: [["kids_and_family", "Daily News"]],
      },
      education_for_kids: {
        name: "kids_and_family_education_for_kids",
        displayName: "Education for Kids",
        match_categories: [["kids_and_family", "Education for Kids"]],
      },
      kids_family: {
        name: "kids_and_family_kids_family",
        displayName: "Kids & Family",
        match_categories: [["kids_and_family", "Kids & Family"]],
      },
      parenting: {
        name: "kids_and_family_parenting",
        displayName: "Parenting",
        match_categories: [["kids_and_family", "Parenting"]],
      },
      pets_animals: {
        name: "kids_and_family_pets_animals",
        displayName: "Pets & Animals",
        match_categories: [["kids_and_family", "Pets & Animals"]],
      },
      stories_for_kids: {
        name: "kids_and_family_stories_for_kids",
        displayName: "Stories for Kids",
        match_categories: [["kids_and_family", "Stories for Kids"]],
      },
    },
  },
  leisure: {
    name: "leisure",
    displayName: "Animation & Manga",
    subcategories: {
      animation_manga: {
        name: "leisure_animation_manga",
        displayName: "Animation & Manga",
        match_categories: [["leisure", "Animation & Manga"]],
      },
      automotive: {
        name: "leisure_automotive",
        displayName: "Automotive",
        match_categories: [["leisure", "Automotive"]],
      },
      aviation: {
        name: "leisure_aviation",
        displayName: "Aviation",
        match_categories: [["leisure", "Aviation"]],
      },
      crafts: {
        name: "leisure_crafts",
        displayName: "Crafts",
        match_categories: [["leisure", "Crafts"]],
      },
      documentary: {
        name: "leisure_documentary",
        displayName: "Documentary",
        match_categories: [["leisure", "Documentary"]],
      },
      games: {
        name: "leisure_games",
        displayName: "Games",
        match_categories: [["leisure", "Games"]],
      },
      hobbies: {
        name: "leisure_hobbies",
        displayName: "Hobbies",
        match_categories: [["leisure", "Hobbies"]],
      },
      home_garden: {
        name: "leisure_home_garden",
        displayName: "Home & Garden",
        match_categories: [["leisure", "Home & Garden"]],
      },
      leisure: {
        name: "leisure_leisure",
        displayName: "Leisure",
        match_categories: [["leisure", "Leisure"]],
      },
      society_culture: {
        name: "leisure_society_culture",
        displayName: "Society & Culture",
        match_categories: [["leisure", "Society & Culture"]],
      },
      video_games: {
        name: "leisure_video_games",
        displayName: "Video Games",
        match_categories: [["leisure", "Video Games"]],
      },
    },
  },
  music: {
    name: "music",
    displayName: "Books",
    subcategories: {
      books: {
        name: "music_books",
        displayName: "Books",
        match_categories: [["music", "Books"]],
      },
      music: {
        name: "music_music",
        displayName: "Music",
        match_categories: [["music", "Music"]],
      },
      music_commentary: {
        name: "music_music_commentary",
        displayName: "Music Commentary",
        match_categories: [["music", "Music Commentary"]],
      },
      music_history: {
        name: "music_music_history",
        displayName: "Music History",
        match_categories: [["music", "Music History"]],
      },
      music_interviews: {
        name: "music_music_interviews",
        displayName: "Music Interviews",
        match_categories: [["music", "Music Interviews"]],
      },
    },
  },
  news: {
    name: "news",
    displayName: "Business News",
    subcategories: {
      world: {
        name: "news_world",
        displayName: "World",
        desc: "World news and international affairs",
        match_categories: [
          ["news", "Business News"],
          ["news", "Daily News"],
          ["news", "News"],
          ["news", "News Commentary"],
          ["news", "Politics"],
        ],
      },
      us: {
        name: "news_us",
        displayName: "US",
        desc: "News about the United States",
        match_categories: [
          ["news", "Business News"],
          ["news", "Daily News"],
          ["news", "News"],
          ["news", "News Commentary"],
          ["news", "Politics"],
        ],
      },
      canada: {
        name: "news_canada",
        displayName: "Canada",
        desc: "News about Canada",
        match_categories: [
          ["news", "Business News"],
          ["news", "Daily News"],
          ["news", "News"],
          ["news", "News Commentary"],
          ["news", "Politics"],
        ],
      },
      uk: {
        name: "news_uk",
        displayName: "UK",
        desc: "News about the United Kingdom",
        match_categories: [
          ["news", "Business News"],
          ["news", "Daily News"],
          ["news", "News"],
          ["news", "News Commentary"],
          ["news", "Politics"],
        ],
      },
      europe: {
        name: "news_europe",
        displayName: "Europe",
        desc: "News about Europe",
        match_categories: [
          ["news", "Business News"],
          ["news", "Daily News"],
          ["news", "News"],
          ["news", "News Commentary"],
          ["news", "Politics"],
        ],
      },
      ukraine: {
        name: "news_ukraine",
        displayName: "Ukraine",
        desc: "News related to Ukraine and the war",
        match_categories: [
          ["news", "Business News"],
          ["news", "Daily News"],
          ["news", "News"],
          ["news", "News Commentary"],
          ["news", "Politics"],
        ],
      },
      middleeast: {
        name: "news_middleeast",
        displayName: "Middle East",
        desc: "News from the Middle East region",
        match_categories: [
          ["news", "Business News"],
          ["news", "Daily News"],
          ["news", "News"],
          ["news", "News Commentary"],
          ["news", "Politics"],
        ],
      },
      business_news: {
        name: "news_business_news",
        displayName: "Business News",
        match_categories: [["news", "Business News"]],
      },
      daily_news: {
        name: "news_daily_news",
        displayName: "Daily News",
        match_categories: [["news", "Daily News"]],
      },
      entertainment_news: {
        name: "news_entertainment_news",
        displayName: "Entertainment News",
        match_categories: [["news", "Entertainment News"]],
      },
      news: {
        name: "news_news",
        displayName: "News",
        match_categories: [["news", "News"]],
      },
      news_commentary: {
        name: "news_news_commentary",
        displayName: "News Commentary",
        match_categories: [["news", "News Commentary"]],
      },
      politics: {
        name: "news_politics",
        displayName: "Politics",
        match_categories: [["news", "Politics"]],
      },
      sports_news: {
        name: "news_sports_news",
        displayName: "Sports News",
        match_categories: [["news", "Sports News"]],
      },
      tech_news: {
        name: "news_tech_news",
        displayName: "Tech News",
        match_categories: [["news", "Tech News"]],
      },
    },
  },
  religion_and_spirituality: {
    name: "religion_and_spirituality",
    displayName: "Buddhism",
    subcategories: {
      buddhism: {
        name: "religion_and_spirituality_buddhism",
        displayName: "Buddhism",
        match_categories: [["religion_and_spirituality", "Buddhism"]],
      },
      christianity: {
        name: "religion_and_spirituality_christianity",
        displayName: "Christianity",
        match_categories: [["religion_and_spirituality", "Christianity"]],
      },
      hinduism: {
        name: "religion_and_spirituality_hinduism",
        displayName: "Hinduism",
        match_categories: [["religion_and_spirituality", "Hinduism"]],
      },
      islam: {
        name: "religion_and_spirituality_islam",
        displayName: "Islam",
        match_categories: [["religion_and_spirituality", "Islam"]],
      },
      judaism: {
        name: "religion_and_spirituality_judaism",
        displayName: "Judaism",
        match_categories: [["religion_and_spirituality", "Judaism"]],
      },
      religion: {
        name: "religion_and_spirituality_religion",
        displayName: "Religion",
        match_categories: [["religion_and_spirituality", "Religion"]],
      },
      religion_spirituality: {
        name: "religion_and_spirituality_religion_spirituality",
        displayName: "Religion & Spirituality",
        match_categories: [
          ["religion_and_spirituality", "Religion & Spirituality"],
        ],
      },
      spirituality: {
        name: "religion_and_spirituality_spirituality",
        displayName: "Spirituality",
        match_categories: [["religion_and_spirituality", "Spirituality"]],
      },
    },
  },
  science: {
    name: "science",
    displayName: "Astronomy",
    subcategories: {
      astronomy: {
        name: "science_astronomy",
        displayName: "Astronomy",
        match_categories: [["science", "Astronomy"]],
      },
      chemistry: {
        name: "science_chemistry",
        displayName: "Chemistry",
        match_categories: [["science", "Chemistry"]],
      },
      earth_sciences: {
        name: "science_earth_sciences",
        displayName: "Earth Sciences",
        match_categories: [["science", "Earth Sciences"]],
      },
      education: {
        name: "science_education",
        displayName: "Education",
        match_categories: [["science", "Education"]],
      },
      life_sciences: {
        name: "science_life_sciences",
        displayName: "Life Sciences",
        match_categories: [["science", "Life Sciences"]],
      },
      mathematics: {
        name: "science_mathematics",
        displayName: "Mathematics",
        match_categories: [["science", "Mathematics"]],
      },
      natural_sciences: {
        name: "science_natural_sciences",
        displayName: "Natural Sciences",
        match_categories: [["science", "Natural Sciences"]],
      },
      nature: {
        name: "science_nature",
        displayName: "Nature",
        match_categories: [["science", "Nature"]],
      },
      physics: {
        name: "science_physics",
        displayName: "Physics",
        match_categories: [["science", "Physics"]],
      },
      science: {
        name: "science_science",
        displayName: "Science",
        match_categories: [["science", "Science"]],
      },
      social_sciences: {
        name: "science_social_sciences",
        displayName: "Social Sciences",
        match_categories: [["science", "Social Sciences"]],
      },
    },
  },
  society_and_culture: {
    name: "society_and_culture",
    displayName: "Documentary",
    subcategories: {
      documentary: {
        name: "society_and_culture_documentary",
        displayName: "Documentary",
        match_categories: [["society_and_culture", "Documentary"]],
      },
      personal_journals: {
        name: "society_and_culture_personal_journals",
        displayName: "Personal Journals",
        match_categories: [["society_and_culture", "Personal Journals"]],
      },
      philosophy: {
        name: "society_and_culture_philosophy",
        displayName: "Philosophy",
        match_categories: [["society_and_culture", "Philosophy"]],
      },
      places_travel: {
        name: "society_and_culture_places_travel",
        displayName: "Places & Travel",
        match_categories: [["society_and_culture", "Places & Travel"]],
      },
      relationships: {
        name: "society_and_culture_relationships",
        displayName: "Relationships",
        match_categories: [["society_and_culture", "Relationships"]],
      },
      society_culture: {
        name: "society_and_culture_society_culture",
        displayName: "Society & Culture",
        match_categories: [["society_and_culture", "Society & Culture"]],
      },
    },
  },
  sports: {
    name: "sports",
    displayName: "American Football",
    subcategories: {
      american_football: {
        name: "sports_american_football",
        displayName: "American Football",
        match_categories: [["sports", "American Football"]],
      },
      baseball: {
        name: "sports_baseball",
        displayName: "Baseball",
        match_categories: [["sports", "Baseball"]],
      },
      basketball: {
        name: "sports_basketball",
        displayName: "Basketball",
        match_categories: [["sports", "Basketball"]],
      },
      cricket: {
        name: "sports_cricket",
        displayName: "Cricket",
        match_categories: [["sports", "Cricket"]],
      },
      fantasy_sports: {
        name: "sports_fantasy_sports",
        displayName: "Fantasy Sports",
        match_categories: [["sports", "Fantasy Sports"]],
      },
      football: {
        name: "sports_football",
        displayName: "Football",
        match_categories: [["sports", "Football"]],
      },
      golf: {
        name: "sports_golf",
        displayName: "Golf",
        match_categories: [["sports", "Golf"]],
      },
      hockey: {
        name: "sports_hockey",
        displayName: "Hockey",
        match_categories: [["sports", "Hockey"]],
      },
      rugby: {
        name: "sports_rugby",
        displayName: "Rugby",
        match_categories: [["sports", "Rugby"]],
      },
      running: {
        name: "sports_running",
        displayName: "Running",
        match_categories: [["sports", "Running"]],
      },
      soccer: {
        name: "sports_soccer",
        displayName: "Soccer",
        match_categories: [["sports", "Soccer"]],
      },
      sport: {
        name: "sports_sport",
        displayName: "Sport",
        match_categories: [["sports", "Sport"]],
      },
      sports: {
        name: "sports_sports",
        displayName: "Sports",
        match_categories: [["sports", "Sports"]],
      },
      swimming: {
        name: "sports_swimming",
        displayName: "Swimming",
        match_categories: [["sports", "Swimming"]],
      },
      tennis: {
        name: "sports_tennis",
        displayName: "Tennis",
        match_categories: [["sports", "Tennis"]],
      },
      wilderness: {
        name: "sports_wilderness",
        displayName: "Wilderness",
        match_categories: [["sports", "Wilderness"]],
      },
      wrestling: {
        name: "sports_wrestling",
        displayName: "Wrestling",
        match_categories: [["sports", "Wrestling"]],
      },
    },
  },
  technology: {
    name: "technology",
    displayName: "Courses",
    subcategories: {
      courses: {
        name: "technology_courses",
        displayName: "Courses",
        match_categories: [["technology", "Courses"]],
      },
      technology: {
        name: "technology_technology",
        displayName: "Technology",
        match_categories: [["technology", "Technology"]],
      },
    },
  },
  true_crime: {
    name: "true_crime",
    displayName: "True Crime",
    subcategories: {
      true_crime: {
        name: "true_crime_true_crime",
        displayName: "True Crime",
        match_categories: [["true_crime", "True Crime"]],
      },
    },
  },
  tv_and_film: {
    name: "tv_and_film",
    displayName: "After Shows",
    subcategories: {
      after_shows: {
        name: "tv_and_film_after_shows",
        displayName: "After Shows",
        match_categories: [["tv_and_film", "After Shows"]],
      },
      film_history: {
        name: "tv_and_film_film_history",
        displayName: "Film History",
        match_categories: [["tv_and_film", "Film History"]],
      },
      film_interviews: {
        name: "tv_and_film_film_interviews",
        displayName: "Film Interviews",
        match_categories: [["tv_and_film", "Film Interviews"]],
      },
      film_reviews: {
        name: "tv_and_film_film_reviews",
        displayName: "Film Reviews",
        match_categories: [["tv_and_film", "Film Reviews"]],
      },
      tv_film: {
        name: "tv_and_film_tv_film",
        displayName: "TV & Film",
        match_categories: [["tv_and_film", "TV & Film"]],
      },
      tv_reviews: {
        name: "tv_and_film_tv_reviews",
        displayName: "TV Reviews",
        match_categories: [["tv_and_film", "TV Reviews"]],
      },
    },
  },
};
