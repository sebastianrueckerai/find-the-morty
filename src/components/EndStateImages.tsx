const WinImage = (
  <img
    key="win"
    style={{
      width: 800,
      maxWidth: "80%",
    }}
    src="https://firebasestorage.googleapis.com/v0/b/find-the-morty.appspot.com/o/won.png?alt=media&token=a8e50d7b-c7d3-4737-8203-33363ac1f9ab"
    alt="Winner"
    data-testid="Winner"
  />
);

const LooseImage = (
  <img
    key="loose"
    style={{
      width: 800,
      maxWidth: "80%",
    }}
    src="https://firebasestorage.googleapis.com/v0/b/find-the-morty.appspot.com/o/lost.PNG?alt=media&token=8bddce57-d3db-4a3c-8a70-78570b5d19df"
    alt="Looser"
    data-testid="Looser"
  />
);
export { WinImage, LooseImage };
