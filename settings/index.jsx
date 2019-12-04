function mySettings(props) {
   
  return (
    <Page>
      <Section
        title={<Text bold align="center">Font Color Settings</Text>}>
        <ColorSelect
          settingsKey="color"
          colors={[
          {color: "black"},
          {color: "darkgray"},
          {color: "lightgray"},
          {color: "white"},
          {color: "wheat"},
          {color: "darkseagreen"},
          {color: "forestgreen"},          
          {color: "blue"},
          {color: "deepskyblue"},
          {color: "cadetblue"},
          {color: "cyan"},
          {color: "red"},
          {color: "darkred"},
          {color: "magenta"},
          {color: "plum"},
          {color: "purple"},
          {color: "brown"},
          {color: "maroon"}
          ]}
        />
      </Section>
      <Section>
        <Toggle
          settingsKey="whatTime"
          label="24 Hour Clock (gray) 12 Hour (green)"
        />
      </Section>

      <Section>
        <Select
          label={`Select an offset from GMT (Zulu)`}
          settingsKey="offsetTime"
          options={[
            {name:"Zulu - 5", value: "-05.0"},
            {name:"Zulu - 4", value: "-04.0"},
            {name:"Zulu - 3", value: "-03.0"},
            {name:"Zulu - 2", value: "-02.0"},
            {name:"Zulu - 1", value: "-01.0"},
            {name:"GMT", value: "+25.0"},
            {name:"Zulu + 1", value: "+01.0"},
            {name:"Zulu + 2", value: "+02.0"},
            {name:"Zulu + 3", value: "+03.0"}, 
            {name:"Zulu + 3:30", value: "+03.5"},
            {name:"Zulu + 4", value: "+04.0"},
            {name:"Zulu + 4:30", value: "+04.5"},
            {name:"Zulu + 5", value: "+05.0"},
            {name:"Zulu + 5:30", value: "+05.5"},
            {name:"Zulu + 6", value: "+06.0"},
            {name:"Zulu + 7", value: "+07.0"},
            {name:"Zulu + 8", value: "+08.0"},
            {name:"Zulu + 9", value: "+09.0"},
            {name:"Zulu + 9:30", value: "+09.5"},
            {name:"Zulu + 10", value: "+10.0"},
            {name:"Zulu + 11", value: "+11.0"},
            {name:"Zulu + 12", value: "+12.0"},
            {name:"Zulu + 13", value: "+13.0"},
            {name:"Zulu - 11", value: "-11.0"},
            {name:"Zulu - 10", value: "-10.0"},
            {name:"Zulu - 9", value: "-09.0"},
            {name:"Zulu - 8", value: "-08.0"},
            {name:"Zulu - 7", value: "-07.0"},
            {name:"Zulu - 6", value: "-06.0"}           
          ]}
        />
      </Section>
  </Page>
  );  
}

registerSettingsPage(mySettings);
