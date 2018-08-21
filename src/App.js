import React, { Component } from "react";
import { ReactiveBase, DataSearch } from "@appbaseio/reactivesearch";
import { GeoDistanceDropdown, ReactiveMap } from "@appbaseio/reactivemaps";

import "./styles.css";

class App extends Component {
  render() {
    return (
      <ReactiveBase
        app="meetup_app"
        credentials="lW70IgSjr:87c5ae16-73fb-4559-a29e-0a02760d2181"
        type="meetupdata1"
        mapKey="AIzaSyBQdVcKCe0q_vOBDUvJYpzwGpt_d_uTj4Q"
        theme={{
          typography: {
            fontFamily: "Montserrat"
          },
          colors: {
            primaryColor: "#ff4757"
          }
        }}
      >
        <div className="header">
          <h1>Meetup App</h1>
          <div className="filters">
            <DataSearch
              componentId="search"
              dataField={[
                "group.group_topics.topic_name_raw",
                "venue_name_ngrams",
                "member.member_name"
              ]}
              placeholder="Search for Topic ,Venue or Member"
              autosuggest={true}
              className="search"
            />
            <GeoDistanceDropdown
              componentId="distance"
              dataField="location"
              data={[
                { distance: 10, label: "Within 10 miles" },
                { distance: 20, label: "Within 20 miles" },
                { distance: 50, label: "Within 50 miles" }
              ]}
              defaultSelected={{
                location: "London, UK",
                label: "Within 10 miles"
              }}
              placeholder="Select a distance range.."
              unit="mi"
              className="dropdown-field"
            />
          </div>
        </div>
        <ReactiveMap
          componentId="map"
          dataField="location"
          defaultZoom={15}
          defaultMapStyle="Light Monochrome"
          showMarkerClusters={false}
          pagination
          onPageChange={() => {
            document.getElementById("list").scrollTo(0, 0);
          }}
          className="reactive-map"
          onAllData={(
            hits,
            streamHits,
            loadMore,
            renderMap,
            renderPagination
          ) => (
            <div className="reactive-container" >
              <div id="list" className="list-container">
                {hits.map(data => (
                  <div className="user-container" key={data._id}>
                    <div className="user-image">
                      <img
                        src={data.member.photo}
                        alt={data.member.member_name}
                      />
                    </div>
                    <div className="user-profile">
                      <h3>
                        {data.member.member_name} is going to{" "}
                        {data.event.event_name}
                      </h3>
                      <p>{data.venue_name_ngrams}</p>
                    </div>
                  </div>
                ))}
                {renderPagination()}
              </div>
              <div className="map-container">{renderMap()}</div>
            </div>
          )}
          onData={data => ({
            label: <span>{data.member.member_name}</span>
          })}
          react={{
            and: ["search", "distance"]
          }}
        />
      </ReactiveBase>
    );
  }
}

export default App;
