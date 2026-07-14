import 'dotenv/config';
import prisma from '../lib/prisma';

const rawData = `Wayanad	Chandragiri Auditorium	Kalpetta	Civil Station, Madathumpadi, Kalpetta, Kerala 673121	https://maps.google.com/?q=Chandragiri+Auditorium+Kalpetta
	Adathara Auditorium	Sulthan Bathery	Sultan Bathery, Kerala 673592	https://maps.google.com/?q=Adathara+Auditorium+Sulthan+Bathery
Kozhikode	Grand Auditorium	Kuttichira	Francis Rd, Thekepuram, Kuttichira, Kozhikode 673003	https://maps.google.com/?q=Grand+Auditorium+Kozhikode
	Majestic Auditorium	Kozhikode	Palayam, Kozhikode, Kerala 673002	https://maps.google.com/?q=Majestic+Auditorium+Kozhikode
Malappuram	MSM Auditorium	Malappuram	Down Hill, Malappuram, Kerala 676509	https://maps.google.com/?q=MSM+Auditorium+Malappuram
	PMR Auditorium	Melmuri	PMR City, Melmuri, Malappuram, Kerala 676517	https://maps.google.com/?q=PMR+Auditorium+Malappuram
Palakkad	Hi Tech Auditorium	Pirayiri	Pallikulam, Pirayiri, Palakkad 678004	https://maps.google.com/?q=Hi+Tech+Auditorium+Palakkad
	Krishnakripa Auditorium	Vadakkanthara	Temple Rd, Nellissery, Vadakkanthara, Palakkad 678012	https://maps.google.com/?q=Krishnakripa+Auditorium+Palakkad
Thrissur	Nandanam Auditorium	Thrissur	Marar Road Area, Thrissur 680001	https://maps.google.com/?q=Nandanam+Auditorium+Thrissur
	Thiruvambadi Convention Centre	Thrissur	Marar Rd, Thrissur, Kerala 680001	https://maps.google.com/?q=Thiruvambadi+Convention+Centre+Thrissur
Ernakulam	Bhaskareeyam Convention Centre	Elamakkara	Perandoor Rd, Elamakkara, Kochi 682026	https://maps.google.com/?q=Bhaskareeyam+Convention+Centre+Kochi
	Chakolas Pavilion	Kochi	Marine Drive, Kochi	https://maps.google.com/?q=Chakolas+Pavilion+Kochi
Idukki	Pappens Kitchen Auditorium	Idukki	Idukki Township, Kerala 685602	https://maps.google.com/?q=Pappens+Kitchen+Auditorium+Idukki
	Zion Auditorium	Thodupuzha	Thodupuzha, Idukki	https://maps.google.com/?q=Zion+Auditorium+Thodupuzha
Kottayam	K.C. Mammen Mappillai Hall	Kottayam	Park Lane Rd, Eerayil Kadavu, Kottayam 686001	https://maps.google.com/?q=KC+Mammen+Mappillai+Hall+Kottayam
	Mamman Mappila Hall	Kottayam	Kottayam Town	https://maps.google.com/?q=Mamman+Mappila+Hall+Kottayam
Alappuzha	Raiban Auditorium	Alappuzha	Vellakkinar, Alappuzha 688001	https://maps.google.com/?q=Raiban+Auditorium+Alappuzha
	SS Kalamandir Auditorium	Cherthala	TD Rd, Pullurithakary, Cherthala 688524	https://maps.google.com/?q=SS+Kalamandir+Auditorium+Cherthala
Pathanamthitta	Lijo Auditorium	Pathanamthitta	Pathanamthitta, Kerala 689653	https://maps.google.com/?q=Lijo+Auditorium+Pathanamthitta
	St. Thomas Auditorium	Thiruvalla	Thiruvalla, Pathanamthitta	https://maps.google.com/?q=St+Thomas+Auditorium+Thiruvalla
Kollam	Sana Auditorium	Kollam	Randamkutty, Kollam 691004	https://maps.google.com/?q=Sana+Auditorium+Kollam
	Sumayya Convention Centre	Kottiyam	Kottiyam, Kollam 691571	https://maps.google.com/?q=Sumayya+Convention+Centre+Kottiyam
Thiruvananthapuram	RDR Convention Centre	Edapazhanji	Kochar Rd, Edapazhanji, Thiruvananthapuram 695014	https://maps.google.com/?q=RDR+Convention+Centre+Trivandrum
	Alakapuri Convention Centre	Edapazhanji	Edapazhanji, Thiruvananthapuram	https://maps.google.com/?q=Alakapuri+Convention+Centre+Trivandrum`;

async function main() {
  const lines = rawData.split('\n').map(l => l.trim()).filter(Boolean);
  const venues = [];
  
  let currentDistrict = "";

  for (const line of lines) {
    const parts = line.split('\t');
    if (parts.length < 5) continue;

    const districtCol = parts[0].trim();
    if (districtCol) currentDistrict = districtCol;
    
    const name = parts[1].trim();
    const city = parts[2].trim();
    const address = parts[3].trim();
    const googleMapsUrl = parts[4].trim();

    venues.push({
      district: currentDistrict,
      name,
      city,
      address,
      googleMapsUrl
    });
  }

  // Create a system user to own these venues
  let sysUser = await prisma.user.findFirst({ where: { email: 'system@kalyanam.com' } });
  if (!sysUser) {
    sysUser = await prisma.user.create({
      data: {
        name: 'System',
        email: 'system@kalyanam.com',
      }
    });
  }

  console.log(`Found ${venues.length} venues to seed.`);

  for (const v of venues) {
    let latitude = 10.8505;
    let longitude = 76.2711;

    try {
      const query = encodeURIComponent(`${v.name}, ${v.city}, Kerala`);
      const geocodeRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`, {
        headers: { 'User-Agent': 'KalyanamApp/1.0' }
      });
      const geocodeData = await geocodeRes.json();
      
      if (geocodeData && geocodeData.length > 0) {
        latitude = parseFloat(geocodeData[0].lat);
        longitude = parseFloat(geocodeData[0].lon);
        console.log(`[Success] Geocoded ${v.name}`);
      } else {
        console.log(`[Fallback] Could not geocode ${v.name} directly. Trying just city...`);
        const cityQuery = encodeURIComponent(`${v.city}, ${v.district}, Kerala`);
        const cityRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${cityQuery}&limit=1`, {
          headers: { 'User-Agent': 'KalyanamApp/1.0' }
        });
        const cityData = await cityRes.json();
        if (cityData && cityData.length > 0) {
          latitude = parseFloat(cityData[0].lat);
          longitude = parseFloat(cityData[0].lon);
          console.log(`[Success] Geocoded ${v.city} as fallback`);
        }
      }
    } catch (error) {
      console.log(`[Error] Failed to geocode ${v.name}`);
    }

    await prisma.venue.create({
      data: {
        name: v.name,
        city: v.city,
        district: v.district,
        address: v.address,
        googleMapsUrl: v.googleMapsUrl,
        latitude,
        longitude,
        userId: sysUser.id
      }
    });
    
    // Sleep for 1 second to respect Nominatim API rate limits
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('Seeding complete.');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
