
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

export const CATEGORIES: Categories =
 {home: {name: "", displayName: "Home"}, latest: {name: "latest", displayName: "Latest", subcategories: {latest: {name: "latest", displayName: "Latest", match_categories: [["arts", "Books"], ["education", "Education"], ["news", "Business News"], ["news", "Daily News"], ["news", "News Commentary"], ["news", "News"], ["news", "Politics"], ["society_and_culture", "Documentary"], ["society_and_culture", "Philosophy"], ["society_and_culture", "Society & Culture"]]}}}, news: {name: "news", displayName: "News", subcategories: {world: {name: "world", displayName: "World", desc: "World news and international affairs", match_categories: [["news", "Business News"], ["news", "Daily News"], ["news", "News"], ["news", "News Commentary"], ["news", "Politics"]]}, us: {name: "us", displayName: "US", desc: "News about the United States", match_categories: [["news", "Business News"], ["news", "Daily News"], ["news", "News"], ["news", "News Commentary"], ["news", "Politics"]]}, canada: {name: "canada", displayName: "Canada", desc: "News about Canada", match_categories: [["news", "Business News"], ["news", "Daily News"], ["news", "News"], ["news", "News Commentary"], ["news", "Politics"]]}, uk: {name: "uk", displayName: "UK", desc: "News about the United Kingdom", match_categories: [["news", "Business News"], ["news", "Daily News"], ["news", "News"], ["news", "News Commentary"], ["news", "Politics"]]}, europe: {name: "europe", displayName: "Europe", desc: "News about Europe", match_categories: [["news", "Business News"], ["news", "Daily News"], ["news", "News"], ["news", "News Commentary"], ["news", "Politics"]]}, ukraine: {name: "ukraine", displayName: "Ukraine", desc: "News related to Ukraine and the war", match_categories: [["news", "Business News"], ["news", "Daily News"], ["news", "News"], ["news", "News Commentary"], ["news", "Politics"]]}, middleeast: {name: "middleeast", displayName: "Middle East", desc: "News from the Middle East region", match_categories: [["news", "Business News"], ["news", "Daily News"], ["news", "News"], ["news", "News Commentary"], ["news", "Politics"]]}}}, arts: {name: "arts", displayName: "Arts", subcategories: {}}, business: {name: "business", displayName: "Business", subcategories: {}}, comedy: {name: "comedy", displayName: "Comedy", subcategories: {}}, education: {name: "education", displayName: "Education", subcategories: {}}, fiction: {name: "fiction", displayName: "Fiction", subcategories: {}}, government: {name: "government", displayName: "Government", subcategories: {}}, health_and_fitness: {name: "health_and_fitness", displayName: "Health & Fitness", subcategories: {}}, history: {name: "history", displayName: "History", subcategories: {}}, kids_and_family: {name: "kids_and_family", displayName: "Kids & Family", subcategories: {}}, leisure: {name: "leisure", displayName: "Leisure", subcategories: {}}, music: {name: "music", displayName: "Music", subcategories: {}}, religion_and_spirituality: {name: "religion_and_spirituality", displayName: "Religion & Spirituality", subcategories: {}}, science: {name: "science", displayName: "Science", subcategories: {}}, society_and_culture: {name: "society_and_culture", displayName: "Society & Culture", subcategories: {}}, sports: {name: "sports", displayName: "Sports", subcategories: {}}, technology: {name: "technology", displayName: "Technology", subcategories: {}}, true_crime: {name: "true_crime", displayName: "True Crime", subcategories: {}}, tv_and_film: {name: "tv_and_film", displayName: "Tv & Film", subcategories: {}}}