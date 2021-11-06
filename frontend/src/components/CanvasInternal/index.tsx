import './styles.css';
import gridImage from './grid.jpg';
import React from 'react';
import CanvasInternalToolbar from '../CanvasInternalToolbar';
import CanvasInternalNode from '../CanvasInternalNode';
import { NodeManager } from './NodeManager';
import { GETgameById, GETnodesInGame, GETuserById } from '../../mock-backend';
import NodeView from '../NodeView/nodeview';
import { Node } from '../../types';

interface Props {
  currentGameId: number;
  currentUserId: number;
}

export default class CanvasInternal extends React.Component<Props> {
  nodeManager = new NodeManager();
  activeNode = -1;

  constructor(props: Props) {
    super(props);
    this.nodeManager.addOnUpdateEvent(() => this.setState({}));

    const game = GETgameById(props.currentGameId);
    for (const node of GETnodesInGame(game.id)) {
      this.nodeManager.createNode(node.id, node);
    }
  }

  getActiveNodeFromNodeManager = (): Node => {
    const node = this.nodeManager.allNodes.filter((node) => node.id === this.activeNode)[0];
    return node.dataNode;
  };

  render(): JSX.Element {
    const array = this.nodeManager.allNodes.reverse();

    return (
      <div>
        <div
          className="w"
          onPointerDown={this.nodeManager.onPress}
          onPointerMove={this.nodeManager.onMove}
          onPointerUp={this.nodeManager.onRelease}
          onPointerLeave={this.nodeManager.onRelease}
          onWheel={this.nodeManager.onWheel}
        >
          <div className="c" style={{ transform: `scale(${this.nodeManager.scale})` }}>
            <img
              id="img"
              src={gridImage}
              style={{ left: `${this.nodeManager.getFinalX()}px`, top: `${this.nodeManager.getFinalY()}px` }}
            />

            {array.map((node) => (
              <CanvasInternalNode
                key={node.id}
                xPos={node.xPos}
                yPos={node.yPos}
                nodeWidth={node.width}
                nodeHeight={node.height}
                id={node.id}
                dataNode={node.dataNode}
                onCloseClicked={() => this.nodeManager.removeNode(node.id)}
                onImageClicked={(id) => {
                  this.activeNode = id;
                  this.setState({});
                }}
              />
            ))}
          </div>
        </div>
        <CanvasInternalToolbar
          onCenterClicked={this.nodeManager.setCenter}
          onAddClicked={this.nodeManager.createNodeDefault}
        />

        {this.activeNode !== -1 ? (
          <div className="nodeview-container">
            <NodeView
              node={this.getActiveNodeFromNodeManager()}
              user={GETuserById(this.props.currentUserId)}
              game={GETgameById(this.props.currentGameId)}
              closeCallback={(updatedNode: Node) => {
                const nodeToUpdate = this.nodeManager.allNodes.filter((node) => node.dataNode.id === updatedNode.id)[0];
                nodeToUpdate.dataNode = updatedNode;
                this.activeNode = -1;
                this.setState({});
              }}
            />
          </div>
        ) : null}
      </div>
    );
  }
}
