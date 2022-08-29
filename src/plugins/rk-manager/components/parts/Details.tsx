import { Tooltip } from "@rikka/API/components";
import { Tag, Scale, Person } from "@rikka/API/components/icons";
import * as React from "react";

export interface DetailsProps {
  author: string;
  version: string;
  description: string;
  license: string;
  svgSize: string;
}

export const Details = React.memo<DetailsProps>(
  (info) => (
    <div className='rk-product-details'>
      <div className='description'>
        <Tooltip message="Description" position='top'></Tooltip>
        <span>{info.description}</span>
      </div>
      <div className='metadata'>
        <div className='author'>
          <Tooltip message="Author" position='top'>
            <Person width={info.svgSize} height={info.svgSize}/>
          </Tooltip>
          <span>{info.author}</span>
        </div>
        <div className='version'>
          <Tooltip message="Version" position='top'>
            <Tag width={info.svgSize} height={info.svgSize}/>
          </Tooltip>
          <span>v{info.version}</span>
        </div>
        <div className='license'>
          <Tooltip message="License" position='top'>
            <Scale width={info.svgSize} height={info.svgSize}/>
          </Tooltip>
          <span>{info.license}</span>
        </div>
      </div>
    </div>
  ),
);
