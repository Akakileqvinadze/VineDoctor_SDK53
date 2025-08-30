export type Disease = {
  id: string;
  name: string;
  latin: string;
  symptoms: string[];
  riskFactors: string[];
  image: any;
  tips: string[];
};

export const diseases: Disease[] = [
  {
    id: 'downy',
    name: 'ჭრაქი',
    latin: 'Plasmopara viticola',
    symptoms: ['ზეთიანი ლაქები ფოთლის ზედაპირზე', 'თეთრი მოზრდილი საფარი ქვედა მხარეს', 'ქერტლისებრი ლაქები ყურძენზე'],
    riskFactors: ['ხანგრძლივი ნამი/წვიმა', 'RH > 85%', 'ტემპ 18–24°C'],
    image: require('../../assets/diseases/downy_mildew.jpg'),
    tips: [
      'შენარჩუნება: ჰაერგამტარი ყლორტების ფორმირება, ზედმეტი სიხშირის შემცირება',
      'მონიტორინგი ნამზე და წვიმის შემდეგ',
      'სწრაფი რეაგირება პირველ ნიშნებზე'
    ]
  },
  {
    id: 'powdery',
    name: 'ნაცარი',
    latin: 'Erysiphe necator',
    symptoms: ['ნაცრისფერი ფქვილოვანი საფარი', 'ფოთლის დეფორმაცია', 'კენკრის დაბზარვა'],
    riskFactors: ['მშრალი და თბილი ამინდი', 'ჩრდილოვანი, ცუდად განიავებადი მასივი'],
    image: require('../../assets/diseases/powdery_mildew.jpg'),
    tips: [
      'კანოპის აერაცია: ჭრილობა/თხელა',
      'დაზიანებული ნაწილების მოცილება',
      'პრევენციული დამუშავებების კალენდარი'
    ]
  },
  {
    id: 'botrytis',
    name: 'ნაცრისფერი ობი (ბოტრიტისი)',
    latin: 'Botrytis cinerea',
    symptoms: ['ნაცრისფერი ფუმფულა საფარი მტევანზე', 'წყლიანი ლაქები', 'მტევნის ლპობა'],
    riskFactors: ['წვიმიანი, ნოტიო მოსავლისწინა პერიოდი', 'დაჭეჭყილი კენკრა', 'მჭიდრო მტევანი'],
    image: require('../../assets/diseases/botrytis.jpg'),
    tips: [
      'ჰიგიენა: დაზიანებული მტევნების მოცილება',
      'კანოპის ვენტილაცია',
      'გადაჭარბებული მორწყვა/წვიმის შემდეგ ზედმეტი ფრთხილება'
    ]
  },
  {
    id: 'blackrot',
    name: 'შავი ლპობა',
    latin: 'Guignardia bidwellii',
    symptoms: ['მუქი ლაქები ფოთლებზე, შუაში ღია', 'მტევნის მუქი, ჩაძირული დაზიანებები'],
    riskFactors: ['თბილი, დამდუღრული ამინდი', 'უმართავი სარეველები'],
    image: require('../../assets/diseases/black_rot.jpg'),
    tips: [
      'ინფიცირებული ნარჩენების გატანა',
      'კულტურული პრაქტიკების გაუმჯობესება',
      'საჭიროებისას სპეციალისტის რეკომენდაცია'
    ]
  },
  {
    id: 'phomopsis',
    name: 'ფომოპსისი (ყლორტის ლაქიანობა)',
    latin: 'Diaporthe ampelina',
    symptoms: ['ყლორტზე წაგრძელებული ლაქები', 'ფოთლის პერფორაციები'],
    riskFactors: ['ცივი, სველი გაზაფხული', 'ხანგრძლივი წვიმები'],
    image: require('../../assets/diseases/phomopsis.jpg'),
    tips: [
      'კანოპის ჰიგიენა',
      'სანიტარული გასხვლა',
      'საგაზაფხულო მონიტორინგი'
    ]
  },
  {
    id: 'anthracnose',
    name: 'ანთრაქნოზი',
    latin: 'Elsinoë ampelina',
    symptoms: ['"სასწორის" მსგავსი ლაქები', 'დაზიანებული ტკაცუნა უბნები'],
    riskFactors: ['წვიმიანი პერიოდები', 'ზემო ნაწილების სველი პირობები'],
    image: require('../../assets/diseases/anthracnose.jpg'),
    tips: [
      'ინფიცირებული ნაწილის მოცილება',
      'კანოპის გაშლა',
      'მონიტორინგი გაზაფხულსა და ზაფხულში'
    ]
  }
];
