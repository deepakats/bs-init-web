import React from 'react';
import { models } from 'powerbi-client';
import { PowerBIEmbed } from 'powerbi-client-react';
import 'powerbi-report-authoring';
import Tab from "./../Tab";
import * as config from "./Config";
import './style.scss';

const Dashboard = ({ embedUrl, isAdminUser }) => {
  const sampleReportConfig = {
    type: 'report',
    tokenType: models.TokenType.Aad,
    accessToken: undefined,
    embedUrl: embedUrl,
    id: config.reportId,
    settings: undefined,
  };

  return (
    <>
      <Tab isAdminUser={isAdminUser} tabClassName={'dashboard'}/>
      <div className='engagement-dashboard'>
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <PowerBIEmbed
              embedConfig = { sampleReportConfig }
              cssClassName = { "report-style-class" }
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
