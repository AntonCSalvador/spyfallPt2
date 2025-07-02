import { LocationPack } from './types';

export const locationPacks: LocationPack[] = [
  {
    name: "Classic",
    locations: [
      {
        name: "Beach",
        roles: ["Beach Goer", "Lifeguard", "Surfer", "Fisherman", "Beach Vendor", "Tourist", "Swimmer", "Beach Volleyball Player"]
      },
      {
        name: "Casino",
        roles: ["Gambler", "Dealer", "Security Guard", "Bartender", "Waitress", "Magician", "Bouncer", "Chef"]
      },
      {
        name: "Circus",
        roles: ["Clown", "Acrobat", "Ringmaster", "Juggler", "Magician", "Animal Trainer", "Ticket Seller", "Popcorn Vendor"]
      },
      {
        name: "Corporate Party",
        roles: ["Manager", "Accountant", "Secretary", "Intern", "CEO", "Security Guard", "Janitor", "Consultant"]
      },
      {
        name: "Cruise Ship",
        roles: ["Captain", "Passenger", "Bartender", "Chef", "Waiter", "Musician", "Deck Hand", "Tourist"]
      },
      {
        name: "Day Spa",
        roles: ["Customer", "Masseuse", "Aesthetician", "Manicurist", "Stylist", "Receptionist", "Yoga Instructor", "Guard"]
      },
      {
        name: "Hospital",
        roles: ["Doctor", "Nurse", "Patient", "Surgeon", "Anesthesiologist", "Intern", "Therapist", "Orderly"]
      },
      {
        name: "Hotel",
        roles: ["Doorman", "Security Guard", "Manager", "Housekeeper", "Waiter", "Concierge", "Bartender", "Chef"]
      },
      {
        name: "Military Base",
        roles: ["Commander", "Sergeant", "Medic", "Engineer", "Private", "Colonel", "Sniper", "Tank Driver"]
      },
      {
        name: "Movie Studio",
        roles: ["Director", "Actor", "Cameraman", "Costume Designer", "Producer", "Makeup Artist", "Stuntman", "Security Guard"]
      },
      {
        name: "Ocean Liner",
        roles: ["Captain", "Passenger", "Waiter", "Bartender", "Mechanic", "Musician", "Chef", "Deck Hand"]
      },
      {
        name: "Passenger Train",
        roles: ["Conductor", "Passenger", "Engineer", "Ticket Inspector", "Waiter", "Porter", "Chef", "Security Guard"]
      },
      {
        name: "Pirate Ship",
        roles: ["Captain", "Sailor", "Cook", "Cabin Boy", "Musician", "Cannoneer", "Prisoner", "Sailing Master"]
      },
      {
        name: "Polar Station",
        roles: ["Scientist", "Expedition Leader", "Meteorologist", "Doctor", "Chef", "Mechanic", "Biologist", "Geologist"]
      },
      {
        name: "Police Station",
        roles: ["Detective", "Officer", "Criminal", "Lawyer", "Journalist", "Criminalist", "Archivist", "Patrol Officer"]
      },
      {
        name: "Restaurant",
        roles: ["Waiter", "Chef", "Host", "Dishwasher", "Manager", "Food Critic", "Customer", "Bartender"]
      },
      {
        name: "School",
        roles: ["Teacher", "Student", "Principal", "Janitor", "Librarian", "Coach", "Cafeteria Worker", "Security Guard"]
      },
      {
        name: "Service Station",
        roles: ["Mechanic", "Manager", "Tire Specialist", "Biker", "Car Owner", "Car Wash Operator", "Electrician", "Auto Parts Dealer"]
      },
      {
        name: "Space Station",
        roles: ["Engineer", "Alien", "Pilot", "Commander", "Scientist", "Doctor", "Space Tourist", "Meteorologist"]
      },
      {
        name: "Submarine",
        roles: ["Captain", "Sailor", "Cook", "Mechanic", "Doctor", "Navigator", "Radioman", "Diver"]
      },
      {
        name: "Supermarket",
        roles: ["Customer", "Cashier", "Butcher", "Janitor", "Security Guard", "Food Sample Demonstrator", "Shelf Stocker", "Manager"]
      },
      {
        name: "Theater",
        roles: ["Actor", "Audience Member", "Usher", "Stagehand", "Coat Check Girl", "Playwright", "Director", "Crew Member"]
      },
      {
        name: "University",
        roles: ["Graduate Student", "Professor", "Dean", "Psychologist", "Janitor", "Student", "Dean", "Librarian"]
      }
    ]
  }
];

export function getRandomLocation(): { location: string; roles: string[] } {
  const pack = locationPacks[0]; // Use classic pack for now
  const randomLocation = pack.locations[Math.floor(Math.random() * pack.locations.length)];
  return {
    location: randomLocation.name,
    roles: [...randomLocation.roles] // Create a copy to avoid mutations
  };
} 