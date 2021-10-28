import { Button, TextField } from '@mui/material';
import { ChangeEvent, Component } from 'react';
import { Delete, PersonAdd } from '@mui/icons-material';
import { Link } from 'react-router-dom';

interface Props {
  onInviteUserClicked: (username: string) => void;
}

interface State {
  inviteName: string;
}

export default class Footer extends Component<Props, State> {
  state: State = {
    inviteName: '',
  };

  handleInviteNameChanged = (event: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ inviteName: event.target.value });
  };

  render(): JSX.Element {
    return (
      <div className="footer">
        <div className="footer__item__wrapper">
          <TextField
            className="footer__item"
            id="outlined-basic"
            label="Player name"
            value={this.state.inviteName}
            variant="outlined"
            onChange={this.handleInviteNameChanged}
          />
        </div>
        <div className="footer__item__wrapper">
          <Button
            aria-label="invite user to the game"
            className="footer__item"
            disabled={!this.state.inviteName}
            startIcon={<PersonAdd />}
            variant="contained"
            onClick={() => {
              this.props.onInviteUserClicked(this.state.inviteName);
              this.setState({
                inviteName: '',
              });
            }}
          >
            Invite user
          </Button>
        </div>
        <div className="footer__item__wrapper">
          {/* TODO: update link target */}
          <Link style={{ textDecoration: 'none' }} to=".">
            <Button aria-label="delete game server" className="footer__item" startIcon={<Delete />} variant="contained">
              Delete server
            </Button>
          </Link>
        </div>
      </div>
    );
  }
}
