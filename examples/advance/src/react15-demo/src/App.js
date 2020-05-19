import React, { PureComponent } from 'react';
import styled from 'react-emotion';
import { ThemeProvider } from 'emotion-theming';
import logo from './logo.svg';
import './App.css';

class ThemeWrapper extends PureComponent {
    state = {
        theme: {
            bg: '#282c34',
            color: 'white'
        }
    };
    render() {
        const { children, ...rest } = this.props;
        const { theme = {} } = this.state;
        const { bg, color } = theme;
        return (
            <ThemeProvider theme={this.state.theme} {...rest}>
                <div>
                    <div>
                        <div>
                            <label htmlFor="bg">background: </label>{' '}
                            <input
                                id="bg"
                                defaultValue={bg}
                                onChange={e => this.setState({ theme: { ...this.state.theme, bg: e.target.value } })}
                            ></input>
                        </div>

                        <div>
                            <label htmlFor="color">color: </label>{' '}
                            <input
                                id="color"
                                defaultValue={color}
                                onChange={e => this.setState({ theme: { ...this.state.theme, color: e.target.value } })}
                            ></input>
                        </div>
                    </div>
                    {children}
                </div>
            </ThemeProvider>
        );
    }
}

const Wrapper = styled('div')`
    background: ${props => props.theme.bg};
    color: ${props => props.theme.color};
`;

function App() {
    return (
        <ThemeWrapper>
            <Wrapper>
                <header>
                    <img src={logo} className="App-logo" alt="logo" />
                    <p>
                        Edit <code>src/App.js</code> and save to reload.
                    </p>
                    <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
                        Learn React
                    </a>
                </header>
                <div>12312321312</div>
            </Wrapper>
        </ThemeWrapper>
    );
}

export default App;
