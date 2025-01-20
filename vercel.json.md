
Q1) Why have this setting in vercel.json?
{
  "rewrites": [
    {
      "source": "/forms/(.*)",
      "destination": "https://forms-9tbfrcghs-scs-projects-83c4512e.vercel.app/$1"
    }
  ]
}

Answer) For the end user we want them to see www.associateattorney.ai/forms/ but internally we want to keep forms a seperate github repo and a seperate vercel project