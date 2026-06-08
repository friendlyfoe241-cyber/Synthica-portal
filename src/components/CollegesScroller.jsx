const CollegesScroller = () => {
  const logos = [
    '/assets/colleges/2.png',
    '/assets/colleges/3.png',
    '/assets/colleges/4.png',
    '/assets/colleges/5.png',
    '/assets/colleges/6.png',
    '/assets/colleges/7.png',
    '/assets/colleges/8.png',
  ];

  return (
    <section className="colleges-section">
      <h2 className="colleges-heading">Backed by researchers from</h2>
      <div className="colleges-scroller">
        <div className="colleges-track">
          {[...logos, ...logos].map((src, index) => (
            <img 
              key={index}
              src={src} 
              alt="Prestigious University Partner" 
              className="college-logo" 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollegesScroller;
